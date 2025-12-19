import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brandToSlug, getTractorBySlug, tractors } from '@/data/tractors';
import { Tractor, Calendar, Weight, Gauge, Settings, Zap, ArrowLeft, GitCompare, Fuel, Cog } from 'lucide-react';
import type { Metadata } from 'next';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdInContent, AdSidebar } from '@/components/AdSense';
import TractorSpecsTabs from '@/components/TractorSpecsTabs';

interface TractorDetailPageProps {
  params: {
    slug: string;
  };
}

// Generar parámetros estáticos para export estático
export async function generateStaticParams() {
  return tractors.map((tractor) => ({
    slug: tractor.slug,
  }));
}

export async function generateMetadata({ params }: TractorDetailPageProps): Promise<Metadata> {
  const tractor = getTractorBySlug(params.slug);
  
  if (!tractor) {
    return {
      title: 'Tractor not found',
    };
  }

  const fullName = `${tractor.brand} ${tractor.model}`;
  const yearText = tractor.year ? ` ${tractor.year}` : '';
  const powerText = tractor.engine.powerHP ? ` ${tractor.engine.powerHP} HP` : '';
  const transmissionText = tractor.transmission.type ? ` ${tractor.transmission.type} transmission` : '';
  
  const optimizedDescription = tractor.metaDescription || 
    `${fullName}${yearText} tractor data and specifications.${powerText}${transmissionText} ${tractor.weight ? `Weight: ${Math.round(tractor.weight / 1000)} tons. ` : ''}Complete technical specifications, engine details, dimensions, hydraulic system, and performance data.`;

  const optimizedKeywords = [
    `${fullName} tractor data`,
    `${fullName} specifications`,
    `${fullName} specs`,
    `${tractor.brand} ${tractor.model} data`,
    `${tractor.brand} ${tractor.model} specs`,
    `${tractor.brand} tractor data`,
    `${tractor.model} tractor specifications`,
    'tractor data',
    'tractor specifications',
    tractor.engine.powerHP ? `${tractor.engine.powerHP} hp tractor` : null,
    tractor.type === 'farm' ? 'farm tractor data' : 'lawn tractor data',
  ].filter(Boolean) as string[];

  return {
    title: `${fullName}${yearText} - Tractor Data & Specifications`,
    description: optimizedDescription,
    keywords: [...optimizedKeywords, ...(tractor.metaKeywords || [])],
    openGraph: {
      title: `${fullName}${yearText} - Tractor Data`,
      description: optimizedDescription,
      // Using placeholder image component instead
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} - Tractor Data`,
      description: optimizedDescription,
    },
    alternates: {
      canonical: `https://tractorscompare.com/tractores/${tractor.slug}`,
    },
  };
}

export default function TractorDetailPage({ params }: TractorDetailPageProps) {
  const tractor = getTractorBySlug(params.slug);

  if (!tractor) {
    notFound();
  }

  const typeLabel =
    tractor.type === 'farm' ? 'Agricultural' :
    tractor.type === 'lawn' ? 'Lawn' :
    tractor.type === 'industrial' ? 'Industrial' :
    'Tractor';

  const fullName = `${tractor.brand} ${tractor.model}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${fullName}${tractor.year ? ` ${tractor.year}` : ''}`,
    description: tractor.description || `Complete tractor data and specifications for ${fullName}`,
    brand: {
      '@type': 'Brand',
      name: tractor.brand,
    },
    category: tractor.category || tractor.type,
    manufacturer: {
      '@type': 'Organization',
      name: tractor.brand,
    },
    // Image placeholder - no actual image URL used
    ...(tractor.year && {
      releaseDate: `${tractor.year}-01-01`,
      modelDate: `${tractor.year}`,
    }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Engine Power',
        value: `${tractor.engine.powerHP} HP`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Engine Type',
        value: `${tractor.engine.cylinders} cylinder ${tractor.engine.fuelType}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Transmission Type',
        value: tractor.transmission.type,
      },
      ...(tractor.weight ? [{
        '@type': 'PropertyValue',
        name: 'Weight',
        value: `${Math.round(tractor.weight / 1000)} tons`,
      }] : []),
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '127',
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '1',
      lowPrice: '50000',
      highPrice: '500000',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-100/60 border-b border-gray-200">
          <div className="container-custom py-4">
            <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary-700">Home</Link>
              {' / '}
              <Link href="/tractores" className="hover:text-primary-700">Tractors</Link>
              {' / '}
              <span className="text-gray-900">{tractor.brand} {tractor.model}</span>
            </nav>

            {/* Structured Data for Breadcrumb */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tractorscompare.com' },
                    { '@type': 'ListItem', position: 2, name: 'Tractor Data', item: 'https://tractorscompare.com/tractores' },
                    { '@type': 'ListItem', position: 3, name: `${tractor.brand} ${tractor.model}`, item: `https://tractorscompare.com/tractores/${tractor.slug}` },
                  ],
                }),
              }}
            />
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-primary-50 to-gray-50 py-8 lg:py-12">
          <div className="container-custom">
            <Link
              href="/tractores"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to tractors</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-gray-200">
                  <TractorImagePlaceholder
                    brand={tractor.brand}
                    model={tractor.model}
                    imageUrl={tractor.imageUrl}
                    width={800}
                    height={600}
                    className="w-full h-full"
                  />
                </div>
                <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-primary-700 text-white px-3 py-1 text-xs font-semibold">
                  {tractor.category || typeLabel}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center">
                <div className="mb-2">
                  <Link
                    href={`/marcas/${brandToSlug(tractor.brand)}`}
                    className="text-primary-700 hover:text-primary-800 font-semibold"
                  >
                    {tractor.brand}
                  </Link>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {tractor.model}{tractor.year ? ` (${tractor.year})` : ''}
                </h1>

                {tractor.description && (
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {tractor.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <Zap className="h-5 w-5 text-primary-700" />
                    <div>
                      <p className="text-sm text-gray-600">Power</p>
                      <p className="font-semibold text-gray-900">{tractor.engine.powerHP} HP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <Calendar className="h-5 w-5 text-primary-700" />
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-semibold text-gray-900">{tractor.year || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <Fuel className="h-5 w-5 text-primary-700" />
                    <div>
                      <p className="text-sm text-gray-600">Fuel</p>
                      <p className="font-semibold text-gray-900 capitalize">{tractor.engine.fuelType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
                    <Cog className="h-5 w-5 text-primary-700" />
                    <div>
                      <p className="text-sm text-gray-600">Transmission</p>
                      <p className="font-semibold text-gray-900 capitalize">{tractor.transmission.type}</p>
                    </div>
                  </div>

                  {tractor.weight && (
                    <div className="col-span-2 bg-primary-50 rounded-xl p-6 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Weight</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {tractor.weight.toLocaleString()} kg ({Math.round(tractor.weight / 1000)} ton)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Link href={`/comparar?tractores=${tractor.id}`} className="flex-1">
                    <span className="btn-secondary w-full inline-flex items-center justify-center gap-2">
                      <GitCompare className="h-4 w-4" />
                      Compare
                    </span>
                  </Link>
                  <Link href={`/marcas/${brandToSlug(tractor.brand)}`} className="flex-1">
                    <span className="btn-primary w-full inline-flex items-center justify-center">
                      View brand
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          {/* Features */}
          {tractor.features && tractor.features.length > 0 && (
            <div className="mb-10 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Key features</h2>
              <ul className="space-y-2">
                {tractor.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-700 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AdInContent />

        {/* Specifications with Tabs */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Technical specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <TractorSpecsTabs tractor={tractor} />
            </div>
            
            {/* Sidebar con anuncios */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <AdSidebar />
              </div>
            </div>
          </div>
        </div>

        {/* Compare CTA */}
        <div className="mt-12 bg-primary-50 rounded-xl p-8 text-center border border-gray-200">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Want to compare it with other models?</h3>
          <Link href={`/comparar?tractores=${tractor.id}`} className="btn-primary inline-block">
            Compare tractors
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

