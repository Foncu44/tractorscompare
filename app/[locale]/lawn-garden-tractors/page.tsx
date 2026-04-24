import { TractoresJardinView } from '@/components/TractoresJardinView';
import type { Locale } from '@/lib/i18n/config';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

const SITE_NAME = 'TractorsCompare';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  const title = isEs
    ? `Tractores de Jardín y Cortacésped — Especificaciones y Base de Datos | ${SITE_NAME}`
    : `Lawn & Garden Tractors — Specs, HP & Database | ${SITE_NAME}`;
  const description = isEs
    ? 'Explora cortacéspedes y tractores de jardín por marca y potencia. Especificaciones completas y comparativas para elegir el mejor modelo.'
    : 'Browse lawn and garden tractors by brand and horsepower. Free specs database for riding mowers and lawn tractors — find your ideal model.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${BASE_URL}/${locale}/${isEs ? 'tractores-jardin' : 'lawn-garden-tractors'}`,
      images: [{ url: `${BASE_URL}/en/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export default async function LawnGardenTractorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TractoresJardinView locale={locale as Locale} />;
}
