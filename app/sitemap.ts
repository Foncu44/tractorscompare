import { MetadataRoute } from 'next';
import { brandToSlug, tractors, getAllBrands } from '@/data/tractors';
import blogData from '@/data/blog.json';
import { BEST_CATEGORIES } from '@/lib/tractorIntelligence/seo/bestCategory';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tractorscompare.com';

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tractores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tractores-agricolas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tractores-jardin`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/comparar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/marcas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/noticias`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/specs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/used`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Best category pages (Tractor Intelligence)
  const bestPages: MetadataRoute.Sitemap = BEST_CATEGORIES.map((c) => ({
    url: `${baseUrl}/best/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Compare pages (subset generated at build)
  const compareSlugs = tractors
    .filter((t) => t.slug && t.engine?.powerHP != null && t.transmission?.type)
    .map((t) => t.slug)
    .slice(0, 40);
  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < compareSlugs.length - 1 && comparePages.length < 25; i += 2) {
    comparePages.push({
      url: `${baseUrl}/compare/${compareSlugs[i]}-vs-${compareSlugs[i + 1]}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    });
  }

  // Type pages
  const typePages: MetadataRoute.Sitemap = ['compact', 'utility', 'lawn', 'mower'].map((type) => ({
    url: `${baseUrl}/type/${type}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Páginas de tractores
  const tractorPages: MetadataRoute.Sitemap = tractors.map((tractor) => ({
    url: `${baseUrl}/tractores/${tractor.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Páginas de marcas
  const brandPages: MetadataRoute.Sitemap = getAllBrands().map((brand) => ({
    url: `${baseUrl}/marcas/${brandToSlug(brand)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Páginas del blog
  const blogPages: MetadataRoute.Sitemap = blogData.articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...bestPages, ...comparePages, ...typePages, ...tractorPages, ...brandPages, ...blogPages];
}

