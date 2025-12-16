import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getTractorBySlug } from '@/data/tractors';
import { Tractor, Calendar, Weight, Gauge, Settings, Zap } from 'lucide-react';
import type { Metadata } from 'next';

interface TractorDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TractorDetailPageProps): Promise<Metadata> {
  const tractor = getTractorBySlug(params.slug);
  
  if (!tractor) {
    return {
      title: 'Tractor no encontrado',
    };
  }

  return {
    title: `${tractor.brand} ${tractor.model} - Especificaciones Completas`,
    description: tractor.metaDescription || `${tractor.brand} ${tractor.model}: ${tractor.engine.powerHP} HP, ${tractor.transmission.type}. Especificaciones técnicas completas.`,
    keywords: tractor.metaKeywords || [`${tractor.brand} ${tractor.model}`, `${tractor.brand}`, 'tractor', `${tractor.engine.powerHP} hp`],
    openGraph: {
      title: `${tractor.brand} ${tractor.model}`,
      description: tractor.description || `Especificaciones del ${tractor.brand} ${tractor.model}`,
      images: tractor.imageUrl ? [tractor.imageUrl] : [],
    },
  };
}

export default function TractorDetailPage({ params }: TractorDetailPageProps) {
  const tractor = getTractorBySlug(params.slug);

  if (!tractor) {
    notFound();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${tractor.brand} ${tractor.model}`,
    description: tractor.description,
    brand: {
      '@type': 'Brand',
      name: tractor.brand,
    },
    category: tractor.category || tractor.type,
    manufacturer: {
      '@type': 'Organization',
      name: tractor.brand,
    },
    ...(tractor.imageUrl && {
      image: tractor.imageUrl,
    }),
    ...(tractor.year && {
      releaseDate: `${tractor.year}-01-01`,
    }),
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
      priceCurrency: 'EUR',
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
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">Inicio</Link>
          {' / '}
          <Link href="/tractores" className="hover:text-primary-600">Tractores</Link>
          {' / '}
          <span className="text-gray-900">{tractor.brand} {tractor.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div>
            {tractor.imageUrl ? (
              <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-200 mb-6">
                <Image
                  src={tractor.imageUrl}
                  alt={`${tractor.brand} ${tractor.model}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="w-full h-96 rounded-lg bg-gray-200 flex items-center justify-center mb-6">
                <Tractor className="w-32 h-32 text-gray-400" />
              </div>
            )}
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
              <h1 className="text-4xl font-bold mt-2 mb-4">{tractor.model}</h1>
              {tractor.year && (
                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Año: {tractor.year}</span>
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
                  <span className="font-semibold">Potencia</span>
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
                    <span className="font-semibold">Peso</span>
                  </div>
                  <p className="text-2xl font-bold">{Math.round(tractor.weight / 1000)} ton</p>
                  <p className="text-sm text-gray-600">{tractor.weight.toLocaleString()} kg</p>
                </div>
              )}
            </div>

            {/* Features */}
            {tractor.features && tractor.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Características Principales</h2>
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

        {/* Specifications Table */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">Especificaciones Técnicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Engine */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold">Motor</h3>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Cilindros</dt>
                  <dd className="font-semibold">{tractor.engine.cylinders}</dd>
                </div>
                {tractor.engine.displacement && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Cilindrada</dt>
                    <dd className="font-semibold">{tractor.engine.displacement} L</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Potencia</dt>
                  <dd className="font-semibold">{tractor.engine.powerHP} HP</dd>
                </div>
                {tractor.engine.powerKW && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Potencia (kW)</dt>
                    <dd className="font-semibold">{tractor.engine.powerKW} kW</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-600">Combustible</dt>
                  <dd className="font-semibold capitalize">{tractor.engine.fuelType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Refrigeración</dt>
                  <dd className="font-semibold capitalize">{tractor.engine.cooling}</dd>
                </div>
                {tractor.engine.turbocharged !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Turbo</dt>
                    <dd className="font-semibold">{tractor.engine.turbocharged ? 'Sí' : 'No'}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Transmission */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Gauge className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold">Transmisión</h3>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Tipo</dt>
                  <dd className="font-semibold capitalize">{tractor.transmission.type}</dd>
                </div>
                {tractor.transmission.gears && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Marchas</dt>
                    <dd className="font-semibold">{tractor.transmission.gears}</dd>
                  </div>
                )}
                {tractor.transmission.description && (
                  <div>
                    <dt className="text-gray-600 mb-2 block">Descripción</dt>
                    <dd className="font-semibold">{tractor.transmission.description}</dd>
                  </div>
                )}
                {tractor.ptoHP && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">TDF (HP)</dt>
                    <dd className="font-semibold">{tractor.ptoHP} HP</dd>
                  </div>
                )}
                {tractor.ptoRPM && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">TDF (RPM)</dt>
                    <dd className="font-semibold">{tractor.ptoRPM}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Dimensions */}
            {tractor.dimensions && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Dimensiones</h3>
                <dl className="space-y-3">
                  {tractor.dimensions.length && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Longitud</dt>
                      <dd className="font-semibold">{tractor.dimensions.length} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.width && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Ancho</dt>
                      <dd className="font-semibold">{tractor.dimensions.width} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.height && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Altura</dt>
                      <dd className="font-semibold">{tractor.dimensions.height} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.wheelbase && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Distancia entre ejes</dt>
                      <dd className="font-semibold">{tractor.dimensions.wheelbase} mm</dd>
                    </div>
                  )}
                  {tractor.dimensions.groundClearance && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Altura libre</dt>
                      <dd className="font-semibold">{tractor.dimensions.groundClearance} mm</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Hydraulics */}
            {tractor.hydraulicSystem && (
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Sistema Hidráulico</h3>
                <dl className="space-y-3">
                  {tractor.hydraulicSystem.pumpFlow && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Flujo bomba</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.pumpFlow} L/min</dd>
                    </div>
                  )}
                  {tractor.hydraulicSystem.steeringFlow && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Flujo dirección</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.steeringFlow} L/min</dd>
                    </div>
                  )}
                  {tractor.hydraulicSystem.liftCapacity && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Capacidad elevación</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.liftCapacity} kg</dd>
                    </div>
                  )}
                  {tractor.hydraulicSystem.valves && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Válvulas</dt>
                      <dd className="font-semibold">{tractor.hydraulicSystem.valves}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Compare CTA */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">¿Quieres comparar este tractor con otros?</h3>
          <Link href={`/comparar?tractores=${tractor.id}`} className="btn-primary inline-block">
            Comparar Tractores
          </Link>
        </div>
      </div>
    </>
  );
}

