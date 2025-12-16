import { MetadataRoute } from 'next';
import { tractors, getAllBrands } from '@/data/tractors';

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
      changeFrequency: 'daily',
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
  ];

  // Páginas de tractores
  const tractorPages: MetadataRoute.Sitemap = tractors.map((tractor) => ({
    url: `${baseUrl}/tractores/${tractor.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Páginas de marcas
  const brandPages: MetadataRoute.Sitemap = getAllBrands().map((brand) => ({
    url: `${baseUrl}/marcas/${brand.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...tractorPages, ...brandPages];
}

