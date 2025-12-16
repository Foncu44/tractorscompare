import Link from 'next/link';
import Image from 'next/image';
import { Tractor, TrendingUp, Search, GitCompare } from 'lucide-react';
import { getAllBrands, tractors } from '@/data/tractors';

export const metadata = {
  title: 'Comparador de Tractores - Especificaciones y Comparación',
  description: 'Compara especificaciones de tractores agrícolas, de jardín e industriales. Más de 18,000 modelos con información detallada de John Deere, Kubota, New Holland, Case IH y más.',
  keywords: ['tractores', 'comparador tractores', 'especificaciones tractores', 'tractores agrícolas'],
};

export default function HomePage() {
  const brands = getAllBrands();
  const featuredTractors = tractors.slice(0, 6);
  const farmTractors = tractors.filter(t => t.type === 'farm').slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Encuentra el Tractor Perfecto
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Compara especificaciones de más de 18,000 tractores agrícolas, de jardín e industriales. 
              Toda la información que necesitas en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tractores" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center">
                Explorar Tractores
              </Link>
              <Link href="/comparar" className="btn-secondary bg-primary-500 text-white hover:bg-primary-400 text-center">
                Comparar Modelos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Búsqueda Avanzada</h3>
              <p className="text-gray-600">
                Encuentra tractores por marca, modelo, potencia, tipo o cualquier especificación.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitCompare className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comparación Detallada</h3>
              <p className="text-gray-600">
                Compara múltiples tractores lado a lado con todas sus especificaciones técnicas.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Información Actualizada</h3>
              <p className="text-gray-600">
                Datos precisos y actualizados de todos los modelos de tractores disponibles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tractors */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Tractores Destacados</h2>
            <Link href="/tractores" className="text-primary-600 hover:text-primary-700 font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTractors.map((tractor) => (
              <Link
                key={tractor.id}
                href={`/tractores/${tractor.slug}`}
                className="card p-6 hover:scale-105 transition-transform"
              >
                {tractor.imageUrl && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={tractor.imageUrl}
                      alt={`${tractor.brand} ${tractor.model}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary-600">{tractor.brand}</span>
                  {tractor.year && (
                    <span className="text-sm text-gray-500">{tractor.year}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{tractor.model}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <Tractor className="w-4 h-4 mr-1" />
                    {tractor.engine.powerHP} HP
                  </span>
                  {tractor.weight && (
                    <span>{Math.round(tractor.weight / 1000)} ton</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{tractor.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">Marcas Principales</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                className="card p-6 text-center hover:border-primary-500 border-2 border-transparent transition-colors"
              >
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {brand.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-700">{brand}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para encontrar tu tractor ideal?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Explora nuestra base de datos completa y compara modelos para tomar la mejor decisión.
          </p>
          <Link href="/tractores" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-block">
            Comenzar Búsqueda
          </Link>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Tractores Destacados',
            description: 'Lista de tractores agrícolas destacados',
            itemListElement: featuredTractors.map((tractor, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: `${tractor.brand} ${tractor.model}`,
                description: tractor.description,
                brand: {
                  '@type': 'Brand',
                  name: tractor.brand,
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.5',
                  reviewCount: '100',
                },
              },
            })),
          }),
        }}
      />
    </>
  );
}

