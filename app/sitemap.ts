/**
 * Chunked sitemap for scale.
 *
 * Google's limits: 50,000 URLs or 50 MB per sitemap file.
 * With 10,690 tractors × 2 locales = 21,380 tractor URLs alone this
 * approaches the limit, so we split into multiple sitemaps:
 *
 *   /sitemap/0  — static pages, best-category, compare, type, brands, blog
 *   /sitemap/1  — tractor pages chunk 1 (up to CHUNK_SIZE × 2 locales)
 *   /sitemap/2  — tractor pages chunk 2
 *   …
 *
 * Next.js App Router creates a sitemap index at /sitemap.xml automatically
 * when generateSitemaps() is exported.
 */

import { MetadataRoute } from 'next';
import { brandToSlug, tractors, getAllBrands } from '@/data/tractors';
import blogData from '@/data/blog.json';
import { BEST_CATEGORIES } from '@/lib/tractorIntelligence/seo/bestCategory';
import { pathForLocale } from '@/lib/i18n/routes';
import { locales } from '@/lib/i18n/config';
import { isTractorIndexable } from '@/lib/tractorSeo';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

/** Max tractor slugs per sitemap chunk (×2 locales = up to 10,000 URLs/file). */
const TRACTOR_CHUNK_SIZE = 5000;

/**
 * Only tractors with a real photo + known core specs are submitted for
 * indexing (see isTractorIndexable). The rest stay live/linkable but are
 * marked noindex on their own page and excluded here, so Google's site-wide
 * quality assessment isn't dragged down by thousands of thin, templated pages.
 */
const indexableTractors = tractors.filter(isTractorIndexable);

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function withLocales(
  logicalPaths: string[],
  options: {
    changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
    lastModified?: Date;
  }
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const logicalPath of logicalPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE}${pathForLocale(logicalPath, locale)}`,
        lastModified: options.lastModified ?? new Date(),
        changeFrequency: options.changeFrequency ?? 'weekly',
        priority: options.priority ?? 0.7,
      });
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// generateSitemaps — tells Next.js how many chunks to build
// ---------------------------------------------------------------------------

export async function generateSitemaps() {
  const tractorChunks = Math.ceil(indexableTractors.length / TRACTOR_CHUNK_SIZE);
  // id=0: static + brand + blog + best pages
  // id=1..tractorChunks: tractor page chunks
  return Array.from({ length: tractorChunks + 1 }, (_, i) => ({ id: i }));
}

// ---------------------------------------------------------------------------
// sitemap — generates one chunk based on `id`
// ---------------------------------------------------------------------------

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  // ── id=0: everything except individual tractor pages ──────────────────────
  if (id === 0) {
    const homeEntries = withLocales([''], { changeFrequency: 'daily', priority: 1.0 });

    const staticLogical = [
      'tractors',
      'agricultural-tractors',
      'lawn-garden-tractors',
      'compare',
      'brands',
      'contact',
      'about-us',
      'privacy',
      'terms',
      'disclaimer',
      'blog',
      'news',
      'specs',
      'used',
      'offers',
      'guides',
    ];
    const staticPages = withLocales(staticLogical, { changeFrequency: 'weekly', priority: 0.7 });

    const bestPages: MetadataRoute.Sitemap = BEST_CATEGORIES.flatMap((c) =>
      locales.map((locale) => ({
        url: `${BASE}${pathForLocale('best/' + c.slug, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      }))
    );

    // Sample compare pages (50 pairs) — only pair up quality-indexable tractors.
    const compareSlugs = indexableTractors
      .filter((t) => t.slug && t.engine?.powerHP != null && t.transmission?.type)
      .map((t) => t.slug)
      .slice(0, 40);
    const comparePages: MetadataRoute.Sitemap = [];
    for (let i = 0; i < compareSlugs.length - 1 && comparePages.length < 50; i += 2) {
      const logicalPath = `compare/${compareSlugs[i]}-vs-${compareSlugs[i + 1]}`;
      for (const locale of locales) {
        comparePages.push({
          url: `${BASE}${pathForLocale(logicalPath, locale)}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        });
      }
    }

    // Type pages
    const typePages: MetadataRoute.Sitemap = ['compact', 'utility', 'lawn', 'mower'].flatMap(
      (type) =>
        locales.map((locale) => ({
          url: `${BASE}${pathForLocale('type/' + type, locale)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
    );

    // Brand pages
    const brandPages: MetadataRoute.Sitemap = getAllBrands().flatMap((brand) =>
      locales.map((locale) => ({
        url: `${BASE}${pathForLocale('brands/' + brandToSlug(brand), locale)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }))
    );

    // Blog pages
    const blogPages: MetadataRoute.Sitemap = blogData.articles.flatMap((article) =>
      locales.map((locale) => ({
        url: `${BASE}${pathForLocale('blog/' + article.slug, locale)}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    );

    return [
      ...homeEntries,
      ...staticPages,
      ...bestPages,
      ...comparePages,
      ...typePages,
      ...brandPages,
      ...blogPages,
    ];
  }

  // ── id=1..N: tractor page chunks ──────────────────────────────────────────
  const chunkIndex = id - 1; // 0-based chunk index
  const start = chunkIndex * TRACTOR_CHUNK_SIZE;
  const end = start + TRACTOR_CHUNK_SIZE;
  const chunk = indexableTractors.slice(start, end);

  return chunk.flatMap((tractor) =>
    locales.map((locale) => {
      const pageUrl = `${BASE}${pathForLocale('tractors/' + tractor.slug, locale)}`;
      // OG image is always available (generated by opengraph-image.tsx).
      // Real tractor photo (Wikimedia etc.) is listed first when available so
      // Google Image Search indexes the actual photo, not just the OG image.
      const ogImageUrl = `${pageUrl}/opengraph-image`;
      const realImageUrl = tractor.image?.url ?? tractor.imageUrl;
      const images = realImageUrl
        ? [realImageUrl, ogImageUrl]
        : [ogImageUrl];

      return {
        url: pageUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        images,
      };
    })
  );
}
