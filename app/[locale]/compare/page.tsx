import { CompararView } from '@/components/CompararView';
import type { Locale } from '@/lib/i18n/config';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SITE_NAME = 'TractorsCompare';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  const title = isEs
    ? `Comparar Tractores Lado a Lado — HP, Motor y Specs | ${SITE_NAME}`
    : `Compare Tractors Side by Side — HP, Engine & Specs | ${SITE_NAME}`;
  const description = isEs
    ? 'Compara cualquier tractor lado a lado. Potencia, motor, transmisión, PTO, hidráulica, peso y precio — todas las especificaciones de un vistazo.'
    : 'Compare any two tractors side by side. Horsepower, engine, transmission, PTO, hydraulics, weight and price — all specs at a glance. Free tractor comparison tool.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${BASE_URL}/${locale}/${isEs ? 'comparar' : 'compare'}`,
      images: [{ url: `${BASE_URL}/en/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CompararView locale={locale as Locale} />;
}
