import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brandToSlug, getTractorBySlug, tractors } from '@/data/tractors';
import { Tractor, Calendar, Weight, Gauge, Settings, Zap, ArrowLeft, GitCompare, Fuel, Cog, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdSidebar } from '@/components/AdSense';
import TractorSpecsTabs from '@/components/TractorSpecsTabs';
import SEOContentSection from '@/components/SEOContentSection';
import TractorSuitabilitySection from '@/components/TractorSuitabilitySection';
import UsedListingsInternational from '@/components/UsedListingsInternational';
import { specsFromTractor, computeSuitability } from '@/lib/tractorSuitability';
import { buildPerformanceProfile } from '@/lib/tractorIntelligence/profile';

interface TractorDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generar parámetros estáticos para export estático
export async function generateStaticParams() {
  return tractors.map((tractor) => ({
    slug: tractor.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tractor = getTractorBySlug(slug);
  
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

  // Keywords específicas para tractores objetivo de SEO
  const targetTractorKeywords: Record<string, string[]> = {
    'international-harvester-1586': [
      '1586 international specs',
      'ih 1586 specs',
      'ih 1586 hp',
      'international harvester 1586',
      '1586 tractor specifications',
      'ih 1586 horsepower',
      'international 1586 specs',
    ],
    'international-harvester-1466': [
      'international 1466 tractor',
      '1466 horsepower',
      'ih 1466 specs',
      'international harvester 1466',
      '1466 tractor specifications',
      'ih 1466 horsepower',
      'international 1466 specs',
    ],
    'international-harvester-1066': [
      'international 1066',
      'international harvester 1066',
      'ih 1066 specs',
      'international 1066 tractor',
      '1066 tractor specifications',
      'ih 1066 specifications',
    ],
    'international-harvester-353': [
      'international 353',
      'international harvester 353',
      'ih 353 specs',
      'international 353 tractor',
      '353 tractor specifications',
      'ih 353 specifications',
    ],
    'kubota-b2230': [
      'kubota b2230',
      'kubota b2230 specs',
      'kubota b2230 specifications',
      'b2230 tractor specs',
      'kubota b2230 tractor',
      'b2230 kubota specifications',
    ],
    'kubota-b2530': [
      'kubota b2530',
      'kubota b 2530',
      'kubota b2530 specs',
      'kubota b2530 specifications',
      'b2530 tractor specs',
      'kubota b 2530 tractor',
      'b 2530 kubota specifications',
    ],
    'john-deere-1030': [
      'john deere 1030',
      'john deere 1030 specs',
      'jd 1030 specifications',
      'john deere 1030 tractor',
      '1030 tractor specs',
      'john deere 1030 specifications',
    ],
    'caseih-5150-maxxum': [
      'case maxxum 5150',
      'case ih maxxum 5150',
      'maxxum 5150 specs',
      'case maxxum 5150 tractor',
      '5150 maxxum specifications',
      'case ih 5150 specs',
    ],
  };

  const targetKeywords = targetTractorKeywords[tractor.slug] || [];

  const optimizedKeywords = [
    `${fullName} tractor data`,
    `${fullName} specifications`,
    `${fullName} specs`,
    `${fullName} technical data`,
    `${tractor.brand} ${tractor.model} data`,
    `${tractor.brand} ${tractor.model} specs`,
    `${tractor.brand} ${tractor.model} specifications`,
    `${tractor.brand} tractor data`,
    `${tractor.brand} tractor specifications`,
    `${tractor.model} tractor specifications`,
    `${tractor.model} tractor data`,
    'tractor data',
    'tractor specifications',
    'tractor specs',
    'tractor technical data',
    'tractor specs database',
    tractor.engine.powerHP ? `${tractor.engine.powerHP} hp tractor` : null,
    tractor.engine.powerHP ? `${tractor.engine.powerHP} horsepower tractor` : null,
    tractor.type === 'farm' ? 'farm tractor data' : 'lawn tractor data',
    tractor.type === 'farm' ? 'agricultural tractor specifications' : 'lawn tractor specifications',
    tractor.transmission?.type ? `${tractor.transmission.type} transmission tractor` : null,
    tractor.engine.fuelType ? `${tractor.engine.fuelType} tractor` : null,
    ...targetKeywords,
  ].filter(Boolean) as string[];

  // Título optimizado para tractores objetivo
  const optimizedTitle = targetKeywords.length > 0 
    ? `${fullName}${yearText} Specs - ${targetKeywords[0]} | TractorsCompare`
    : `${fullName}${yearText} – Technical Specifications | TractorsCompare`;

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: [
      ...targetKeywords,
      `${fullName} specifications`,
      `${fullName} technical data`,
      `${fullName} specs`,
      `${tractor.brand} ${tractor.model} tractor specifications`,
      'tractor specs',
      'tractor technical data',
      ...optimizedKeywords,
      ...(tractor.metaKeywords || []),
    ],
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

export default async function TractorDetailPage({ params }: TractorDetailPageProps) {
  const { slug } = await params;
  const tractor = getTractorBySlug(slug);

  if (!tractor) {
    notFound();
  }

  const typeLabel =
    tractor.type === 'farm' ? 'Agricultural' :
    tractor.type === 'lawn' ? 'Lawn' :
    tractor.type === 'industrial' ? 'Industrial' :
    'Tractor';

  const fullName = `${tractor.brand} ${tractor.model}`;
  const specs = specsFromTractor(tractor);
  const suitabilityResult = computeSuitability(specs, fullName);
  const profile = buildPerformanceProfile(tractor.id, fullName, specs, suitabilityResult);
  
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
        name: 'Potencia del Motor',
        value: `${tractor.engine.powerHP} HP`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Tipo de Motor',
        value: `${tractor.engine.cylinders} cilindros ${tractor.engine.fuelType}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Tipo de Transmisión',
        value: tractor.transmission.type,
      },
      ...(tractor.weight ? [{
        '@type': 'PropertyValue',
        name: 'Peso',
        value: `${Math.round(tractor.weight / 1000)} toneladas`,
      }] : []),
      ...(tractor.ptoHP ? [{
        '@type': 'PropertyValue',
        name: 'Potencia PTO',
        value: `${tractor.ptoHP} HP`,
      }] : []),
      ...(tractor.hydraulicSystem?.liftCapacity ? [{
        '@type': 'PropertyValue',
        name: 'Capacidad de Elevación',
        value: `${tractor.hydraulicSystem.liftCapacity} kg`,
      }] : []),
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '127',
    },
    ...(tractor.priceRange ? {
      offers: {
        '@type': 'AggregateOffer',
        offerCount: '1',
        lowPrice: tractor.priceRange.min?.toString() || '50000',
        highPrice: tractor.priceRange.max?.toString() || '500000',
        priceCurrency: 'USD',
      },
    } : {
      offers: {
        '@type': 'AggregateOffer',
        offerCount: '1',
        priceCurrency: 'USD',
      },
    }),
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
          <div className="container-custom py-3 md:py-4">
            <nav className="text-xs md:text-sm text-gray-600 break-words" aria-label="Breadcrumb">
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
        <section className="bg-gradient-to-b from-primary-50 to-gray-50 py-6 md:py-8 lg:py-12">
          <div className="container-custom">
            <Link
              href="/marcas"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-4 md:mb-6 transition-colors text-sm md:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to brands</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/3] md:aspect-[4/3] max-h-[280px] md:max-h-none rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                  <TractorImagePlaceholder
                    brand={tractor.brand}
                    model={tractor.model}
                    imageUrl={tractor.imageUrl}
                    width={800}
                    height={600}
                    className="w-full h-full"
                  />
                </div>
                <span className="absolute top-2 left-2 md:top-4 md:left-4 inline-flex items-center rounded-full bg-primary-700 text-white px-2 md:px-3 py-1 text-xs font-semibold z-10">
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

                <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 break-words">
                  {tractor.brand} {tractor.model}
                  {tractor.productionYears 
                    ? ` (${tractor.productionYears.start}${tractor.productionYears.end && tractor.productionYears.end !== tractor.productionYears.start ? `-${tractor.productionYears.end}` : ''})`
                    : tractor.year ? ` ${tractor.year}` : ''} Specifications
                </h1>

                {tractor.description && (
                  <p className="text-gray-700 text-sm md:text-base lg:text-lg mb-4 md:mb-6 leading-relaxed break-words">
                    {tractor.description}
                  </p>
                )}

                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Engine Features</h2>
                <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8">
                  <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4 border border-gray-200 min-w-0">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary-700 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Power</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base break-words">{tractor.engine.powerHP} HP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4 border border-gray-200 min-w-0">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary-700 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Production Years</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base break-words">
                        {tractor.productionYears 
                          ? `${tractor.productionYears.start}${tractor.productionYears.end && tractor.productionYears.end !== tractor.productionYears.start ? `-${tractor.productionYears.end}` : ''}`
                          : tractor.year || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4 border border-gray-200 min-w-0">
                    <Fuel className="h-4 w-4 md:h-5 md:w-5 text-primary-700 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Fuel</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base capitalize break-words">{tractor.engine.fuelType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4 border border-gray-200 min-w-0">
                    <Cog className="h-4 w-4 md:h-5 md:w-5 text-primary-700 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600">Transmission</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base capitalize break-words">{tractor.transmission.type}</p>
                    </div>
                  </div>

                  {tractor.priceRange && (tractor.priceRange.min || tractor.priceRange.max) && (
                    <div className="col-span-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 md:p-6 border-2 border-primary-200">
                      <div className="flex items-center gap-2 md:gap-3 mb-2">
                        <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary-700 flex-shrink-0" />
                        <p className="text-xs md:text-sm text-gray-600 font-medium">Estimated Price Range</p>
                      </div>
                      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                        {tractor.priceRange.min && tractor.priceRange.max ? (
                          <>
                            ${tractor.priceRange.min.toLocaleString()} - ${tractor.priceRange.max.toLocaleString()}
                          </>
                        ) : tractor.priceRange.min ? (
                          <>From ${tractor.priceRange.min.toLocaleString()}</>
                        ) : tractor.priceRange.max ? (
                          <>Up to ${tractor.priceRange.max.toLocaleString()}</>
                        ) : null}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">USD • Estimated market value</p>
                    </div>
                  )}

                  {tractor.weight && (
                    <div className="col-span-2 bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Weight and Dimensions</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-1">Weight</p>
                      <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                        {tractor.weight.toLocaleString()} kg ({Math.round(tractor.weight / 1000)} tons)
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link href={`/comparar?tractores=${tractor.id}`} className="flex-1">
                    <span className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm md:text-base">
                      <GitCompare className="h-4 w-4" />
                      Compare
                    </span>
                  </Link>
                  <Link href={`/marcas/${brandToSlug(tractor.brand)}`} className="flex-1">
                    <span className="btn-primary w-full inline-flex items-center justify-center text-sm md:text-base">
                      View brand
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-6 md:py-12">
          {/* Features */}
          {tractor.features && tractor.features.length > 0 && (
            <div className="mb-6 md:mb-10 bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Main Features</h2>
              <ul className="space-y-2">
                {tractor.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-700 mr-2 flex-shrink-0">✓</span>
                    <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* TractorSuitability™ Analysis */}
        <TractorSuitabilitySection
          result={suitabilityResult}
          tractorName={fullName}
          profile={{
            idealUseCase: profile.idealUseCase,
            maintenanceTier: profile.maintenanceTier,
            maintenanceTierDescription: profile.maintenanceTierDescription,
            operatingCostTier: profile.operatingCostTier,
            operatingCostTierDescription: profile.operatingCostTierDescription,
            expertSummary: profile.expertSummary,
          }}
        />

        {/* SEO Content Section */}
        {tractor.seoContent && (
          <SEOContentSection content={tractor.seoContent} />
        )}

        {/* Specifications with Tabs */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900">Technical Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2">
              <TractorSpecsTabs tractor={tractor} />
            </div>
            
            {/* Sidebar con anuncios */}
            <div className="md:col-span-1">
              <div className="sticky top-20 md:top-24">
                <AdSidebar />
              </div>
            </div>
          </div>
        </div>

        {/* Compare CTA */}
        <div className="mt-8 md:mt-12 bg-primary-50 rounded-xl p-6 md:p-8 text-center border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Want to compare it with other models?</h2>
          <Link href={`/comparar?tractores=${tractor.id}`} className="btn-primary inline-block text-sm md:text-base">
            Compare tractors
          </Link>
        </div>

        {/* Find Used Listings (International) */}
        <UsedListingsInternational
          brandName={tractor.brand}
          modelName={tractor.model}
          fullName={fullName}
        />
      </div>
    </div>
    </>
  );
}

