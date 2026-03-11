import type { Metadata } from 'next';
import type { Tractor } from '@/types/tractor';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

interface TractorSeoInput {
  tractor: Tractor;
}

export function buildTractorMetadata({ tractor }: TractorSeoInput): Metadata {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const yearText = tractor.year ? ` ${tractor.year}` : '';
  const hpText = tractor.engine?.powerHP ? ` ${tractor.engine.powerHP} HP` : '';
  const typeLabel = tractor.type === 'farm' ? 'Agricultural' : tractor.type === 'lawn' ? 'Lawn' : 'Industrial';

  const title = `${fullName}${yearText} Specs –${hpText} ${typeLabel} Tractor Data`;
  const description = `Complete ${fullName}${yearText} specifications:${hpText} engine, ${tractor.engine?.cylinders ?? ''}${tractor.engine?.cylinders ? '-cylinder' : ''} ${tractor.engine?.fuelType ?? ''}, ${tractor.transmission?.type ?? ''} transmission. Compare prices, dimensions, PTO power, and more.`;

  const canonical = `${BASE_URL}/tractores/${tractor.slug}`;

  return {
    title,
    description,
    keywords: [
      `${fullName} specs`, `${fullName} horsepower`, `${fullName} specifications`,
      `${tractor.brand} tractors`, `${fullName} price`, `${fullName} review`,
    ],
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

