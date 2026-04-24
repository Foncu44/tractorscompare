import NewsSections, { type NewsItem } from '@/components/NewsSections';
import newsData from '@/data/news.json';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

const SITE_NAME = 'TractorsCompare';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';

  const title = isEs
    ? `Noticias del Sector Tractor — Últimas Novedades | ${SITE_NAME}`
    : `Tractor Industry News & Latest Updates | ${SITE_NAME}`;
  const description = isEs
    ? 'Últimas noticias, tendencias y novedades del sector de la maquinaria agrícola. Mantente informado con TractorsCompare.'
    : 'Latest news, trends, and developments in the agricultural tractor industry. Stay informed with TractorsCompare — new models, market updates, and expert coverage.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: `${BASE_URL}/${locale}/${isEs ? 'noticias' : 'news'}`,
      images: [{ url: `${BASE_URL}/en/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  };
}

export default function NewsPage() {
  const newsItems = ((newsData as { items?: unknown[] }).items || []) as NewsItem[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf7f1] to-white">
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Tractor Industry News
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-3xl">
            Stay informed with the latest news, trends, and developments in the agricultural tractor industry.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <NewsSections items={newsItems} showAll={true} />
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Stay Updated with Tractor Industry News
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              The agricultural tractor industry is constantly evolving. Our news section provides coverage of the latest updates in tractor manufacturing, agricultural machinery, and farming technology.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
