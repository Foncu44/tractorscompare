import { MetadataRoute } from 'next';
import { brandToSlug, tractors, getAllBrands } from '@/data/tractors';
import blogData from '@/data/blog.json';
import { BEST_CATEGORIES } from '@/lib/tractorIntelligence/seo/bestCategory';
import { pathForLocale } from '@/lib/i18n/routes';
import { locales } from '@/lib/i18n/config';

export const dynamic = 'force-static';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

/** Genera entradas del sitemap para cada locale (ES/EN). Cada página aparece como /es/... y /en/... */
function withLocales(
  logicalPaths: string[],
  options: { changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority?: number; lastModified?: Date }
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const path of logicalPaths) {
    for (const locale of locales) {
      const url = `${BASE}${pathForLocale(path, locale)}`;
      entries.push({
        url,
        lastModified: options.lastModified ?? new Date(),
        changeFrequency: (options.changeFrequency ?? 'weekly') as 'weekly',
        priority: options.priority ?? 0.7,
      });
    }
  }
  return entries;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BASE;

  // Home: /en y /es
  const homeEntries = withLocales([''], { changeFrequency: 'daily', priority: 1 });

  // Páginas estáticas en ambos idiomas
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
  const staticPagesRest = withLocales(staticLogical, { changeFrequency: 'weekly', priority: 0.7 });

  // Best: ambos idiomas
  const bestPages: MetadataRoute.Sitemap = [];
  for (const c of BEST_CATEGORIES) {
    for (const locale of locales) {
      bestPages.push({
        url: `${baseUrl}${pathForLocale('best/' + c.slug, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  // Compare (subset)
  const compareSlugs = tractors
    .filter((t) => t.slug && t.engine?.powerHP != null && t.transmission?.type)
    .map((t) => t.slug)
    .slice(0, 40);
  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < compareSlugs.length - 1 && comparePages.length < 50; i += 2) {
    const path = `compare/${compareSlugs[i]}-vs-${compareSlugs[i + 1]}`;
    for (const locale of locales) {
      comparePages.push({
        url: `${baseUrl}${pathForLocale(path, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      });
    }
  }

  // Type
  const typePages: MetadataRoute.Sitemap = [];
  for (const type of ['compact', 'utility', 'lawn', 'mower']) {
    for (const locale of locales) {
      typePages.push({
        url: `${baseUrl}${pathForLocale('type/' + type, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    }
  }

  // Tractores: ambos idiomas (mismo slug)
  const tractorPages: MetadataRoute.Sitemap = [];
  for (const tractor of tractors) {
    for (const locale of locales) {
      tractorPages.push({
        url: `${baseUrl}${pathForLocale('tractors/' + tractor.slug, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  // Marcas
  const brandPages: MetadataRoute.Sitemap = [];
  for (const brand of getAllBrands()) {
    const slug = brandToSlug(brand);
    for (const locale of locales) {
      brandPages.push({
        url: `${baseUrl}${pathForLocale('brands/' + slug, locale)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    }
  }

  // Blog (slug igual en ambos)
  const blogPages: MetadataRoute.Sitemap = blogData.articles.map((article) => {
    const path = `blog/${article.slug}`;
    return locales.map((locale) => ({
      url: `${baseUrl}${pathForLocale(path, locale)}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  }).flat();

  return [...homeEntries, ...staticPagesRest, ...bestPages, ...comparePages, ...typePages, ...tractorPages, ...brandPages, ...blogPages];
}

