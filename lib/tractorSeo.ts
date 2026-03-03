import type { Metadata } from 'next';
import type { Tractor } from '@/types/tractor';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

interface TractorSeoInput {
  tractor: Tractor;
}

export function buildTractorMetadata({ tractor }: TractorSeoInput): Metadata {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const yearText = tractor.year ? ` ${tractor.year}` : '';

  const title = `${fullName} Specs, HP, Engine & Dimensions`;
  const description = `Full specifications for ${fullName}${yearText} including horsepower, engine, transmission, dimensions and production years.`;

  const canonical = `${BASE_URL}/tractores/${tractor.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'TractorsCompare',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

