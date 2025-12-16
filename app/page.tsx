import Link from 'next/link';
import { Tractor, TrendingUp, Search, GitCompare } from 'lucide-react';
import { getAllBrands, tractors } from '@/data/tractors';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdInContent } from '@/components/AdSense';

export const metadata = {
  title: 'Tractor Data - Complete Tractor Specifications Database',
  description: 'Comprehensive tractor data and specifications database. Access detailed technical information for over 18,000 tractors from John Deere, Kubota, New Holland, Case IH and more. Compare specs, find tractor data, and make informed decisions.',
  keywords: ['tractor data', 'tractor specifications', 'tractor database', 'tractor data database', 'tractor specs', 'tractor information', 'tractor compare', 'agricultural tractors', 'john deere', 'kubota', 'new holland'],
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
              Complete Tractor Data & Specifications Database
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Access comprehensive tractor data and specifications for over 18,000 agricultural, lawn, and industrial tractors. 
              Compare specs, find detailed technical information, and make informed decisions with our complete tractor data database.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tractores" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-center">
                Explore Tractors
              </Link>
              <Link href="/comparar" className="btn-secondary bg-primary-500 text-white hover:bg-primary-400 text-center">
                Compare Models
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
              <h3 className="text-xl font-bold mb-2">Advanced Search</h3>
              <p className="text-gray-600">
                Find tractors by brand, model, power, type or any specification.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitCompare className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Comparison</h3>
              <p className="text-gray-600">
                Compare multiple tractors side by side with all their technical specifications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Updated Information</h3>
              <p className="text-gray-600">
                Accurate and up-to-date data on all available tractor models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tractors */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Tractors</h2>
            <Link href="/tractores" className="text-primary-600 hover:text-primary-700 font-semibold">
              View all →
            </Link>
          </div>
          <AdInContent />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTractors.map((tractor) => (
              <Link
                key={tractor.id}
                href={`/tractores/${tractor.slug}`}
                className="card p-6 hover:scale-105 transition-transform"
              >
                <div className="w-full mb-4 rounded-lg overflow-hidden">
                  <TractorImagePlaceholder
                    brand={tractor.brand}
                    model={tractor.model}
                    width={400}
                    height={300}
                    className="w-full h-48 rounded-lg"
                  />
                </div>
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
          <h2 className="text-3xl font-bold mb-8 text-center">Main Brands</h2>
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
            Ready to find your ideal tractor?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Explore our complete database and compare models to make the best decision.
          </p>
          <Link href="/tractores" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-block">
            Start Search
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
            name: 'Featured Tractors',
            description: 'List of featured agricultural tractors',
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

