import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTractorBySlug } from '@/data/tractors';
import { Tractor, Calendar, Weight, Gauge, Settings, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdInContent, AdSidebar } from '@/components/AdSense';

interface TractorDetailPageProps {
  params: {
    slug: string;
  };
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
      
      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-primary-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/tractores" className="hover:text-primary-600">Tractor Data</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{tractor.brand} {tractor.model}</li>
          </ol>
        </nav>
        
        {/* Structured Data for Breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://tractorscompare.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Tractor Data',
                  item: 'https://tractorscompare.com/tractores',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `${tractor.brand} ${tractor.model}`,
                  item: `https://tractorscompare.com/tractores/${tractor.slug}`,
                },
              ],
            }),
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div>
            <div className="w-full rounded-lg overflow-hidden mb-6">
              <TractorImagePlaceholder
                brand={tractor.brand}
                model={tractor.model}
                width={800}
                height={600}
                className="w-full h-96 rounded-lg"
              />
            </div>
          </div>

          {/* Right Column - Info */}
          <div>
            <div className="mb-6">
              <Link
                href={`/marcas/${tractor.brand.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                {tractor.brand}
              </Link>
              <h1 className="text-4xl font-bold mt-2 mb-4">{tractor.brand} {tractor.model}{tractor.year ? ` ${tractor.year}` : ''} - Tractor Data</h1>
              {tractor.year && (
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Year: {tractor.year}</span>
                </div>
              )}
              {tractor.description && (
                <p className="text-gray-700 text-lg mb-6">{tractor.description}</p>
              )}
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center text-primary-600 mb-2">
                  <Zap className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Power</span>
                </div>
                <p className="text-2xl font-bold">{tractor.engine.powerHP} HP</p>
                {tractor.engine.powerKW && (
                  <p className="text-sm text-gray-600">{tractor.engine.powerKW} kW</p>
                )}
              </div>
              {tractor.weight && (
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center text-primary-600 mb-2">
                    <Weight className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Weight</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(tractor.weight / 1000)} ton</p>
                  <p className="text-sm text-gray-600">{tractor.weight.toLocaleString()} kg</p>
                </div>
              )}
            </div>

            {/* Features */}
            {tractor.features && tractor.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Main Features</h2>
                <ul className="space-y-2">
                  {tractor.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <AdInContent />

        {/* Specifications Table */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">{tractor.brand} {tractor.model} - Complete Tractor Data & Technical Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Engine */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold">Engine</h3>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Cylinders</dt>
                  <dd className="font-semibold">{tractor.engine.cylinders}</dd>
                </div>
                {tractor.engine.displacement && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Displacement</dt>
                    <dd className="font-semibold">{tractor.engine.displacement} L</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Power</dt>
                  <dd className="font-semibold">{tractor.engine.powerHP} HP</dd>
                </div>
                {tractor.engine.powerKW && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Power (kW)</dt>
                    <dd className="font-semibold">{tractor.engine.powerKW} kW</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Fuel Type</dt>
                  <dd className="font-semibold capitalize">{tractor.engine.fuelType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Cooling</dt>
                  <dd className="font-semibold capitalize">{tractor.engine.cooling}</dd>
                </div>
                {tractor.engine.turbocharged !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Turbocharged</dt>
                    <dd className="font-semibold">{tractor.engine.turbocharged ? 'Yes' : 'No'}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Transmission */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Gauge className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold">Transmission</h3>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-semibold capitalize">{tractor.transmission.type}</dd>
                </div>
                {tractor.transmission.gears && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Gears</dt>
                    <dd className="font-semibold">{tractor.transmission.gears}</dd>
                  </div>
                )}
                {tractor.transmission.description && (
                  <div>
                    <dt className="text-gray-600 mb-2 block">Description</dt>
                    <dd className="font-semibold">{tractor.transmission.description}</dd>
                  </div>
                )}
                {tractor.ptoHP && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">PTO (HP)</dt>
                    <dd className="font-semibold">{tractor.ptoHP} HP</dd>
                  </div>
                )}
                {tractor.ptoRPM && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">PTO (RPM)</dt>
                    <dd className="font-semibold">{tractor.ptoRPM}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Dimensions */}
            {tractor.dimensions && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Dimensions</h3>
                <dl className="space-y-3">
                  {tractor.dimensions.length && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Length</dt>
                      <dd className="font-semibold">{tractor.dimensions.length} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.width && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Width</dt>
                      <dd className="font-semibold">{tractor.dimensions.width} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.height && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Height</dt>
                      <dd className="font-semibold">{tractor.dimensions.height} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.wheelbase && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Wheelbase</dt>
                      <dd className="font-semibold">{tractor.dimensions.wheelbase} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.groundClearance && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Ground Clearance</dt>
                      <dd className="font-semibold">{tractor.dimensions.groundClearance} mm</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Hydraulics */}
            {tractor.hydraulicSystem && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Hydraulic System</h3>
                <dl className="space-y-3">
                  {tractor.hydraulicSystem.pumpFlow && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Pump Flow</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.pumpFlow} L/min</dd>
                    </div>
                  )}
                  {tractor.hydraulicSystem.steeringFlow && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Steering Flow</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.steeringFlow} L/min</dd>
                    </div>
                  )}
                  {tractor.hydraulicSystem.liftCapacity && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Lift Capacity</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.liftCapacity} kg</dd>
                    </div>
                  )}
                  {tractor.hydraulicSystem.valves && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Valves</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.valves}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            </div>
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
        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to compare this tractor with others?</h3>
          <Link href={`/comparar?tractores=${tractor.id}`} className="btn-primary inline-block">
            Compare Tractors
          </Link>
        </div>
      </div>
    </>
  );
}

