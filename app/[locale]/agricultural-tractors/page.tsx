import { TractoresAgricolasView } from '@/components/TractoresAgricolasView';
import type { Locale } from '@/lib/i18n/config';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

const SITE_NAME = 'TractorsCompare';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  const title = isEs
    ? `Tractores Agrícolas — Especificaciones, CV y Base de Datos | ${SITE_NAME}`
    : `Agricultural Tractors — Specs, HP & Database | ${SITE_NAME}`;
  const description = isEs
    ? 'Explora miles de tractores agrícolas por marca y potencia. Base de datos gratuita con especificaciones completas de motor, transmisión, PTO e hidráulica.'
    : 'Browse thousands of agricultural tractors by brand and horsepower. Free database of farm tractor specifications — engine, transmission, PTO, hydraulics and more.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${BASE_URL}/${locale}/${isEs ? 'tractores-agricolas' : 'agricultural-tractors'}`,
      images: [{ url: `${BASE_URL}/en/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export default async function AgriculturalTractorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TractoresAgricolasView locale={locale as Locale} />;
}
