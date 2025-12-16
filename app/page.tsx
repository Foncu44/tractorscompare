import Link from 'next/link';
import { Tractor, TrendingUp, Search, GitCompare } from 'lucide-react';
import { getAllBrands, tractors, getTractorsByBrand } from '@/data/tractors';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdInContent } from '@/components/AdSense';
import { getBrandLogo, getBrandColor } from '@/lib/brandLogos';
import BrandLogo from '@/components/BrandLogo';

export const metadata = {
  title: 'Tractor Data - Complete Tractor Specifications Database',
  description: 'Comprehensive tractor data and specifications database. Access detailed technical information for over 18,000 tractors from John Deere, Kubota, New Holland, Case IH and more. Compare specs, find tractor data, and make informed decisions.',
  keywords: ['tractor data', 'tractor specifications', 'tractor database', 'tractor data database', 'tractor specs', 'tractor information', 'tractor compare', 'agricultural tractors', 'john deere', 'kubota', 'new holland'],
};

export default function HomePage() {
  const brands = getAllBrands();
  const featuredTractors = tractors.slice(0, 6);
  const farmTractors = tractors.filter(t => t.type === 'farm').slice(0, 4);
  
  // Marcas principales con logos disponibles
  const mainBrands = brands
    .filter(brand => getBrandLogo(brand))
    .slice(0, 10); // Primeras 10 marcas con logos

  return (
    <>
      {/* Hero Section - Estilo TractorData.es */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white py-20 md:py-32 overflow-hidden">
        {/* Background Image Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-transparent to-green-900" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Most Complete Tractor Database
              </h1>
              <p className="text-lg md:text-xl mb-8 text-green-100 leading-relaxed">
                Detailed specifications for over 18,000 agricultural, garden, and industrial tractors. 
                Your definitive resource for machinery information.
              </p>
              
              {/* Search Bar */}
              <form action="/buscar" method="get" className="mb-8">
                <div className="flex gap-2 bg-white rounded-lg p-2 shadow-xl">
                  <Search className="w-6 h-6 text-gray-400 ml-3 my-auto" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search by brand or model..."
                    className="flex-1 px-4 py-3 text-gray-900 focus:outline-none rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Statistics */}
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">
                    {tractors.length.toLocaleString()}
                  </div>
                  <div className="text-green-100 text-sm md:text-base">Tractors</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">
                    {brands.length}+
                  </div>
                  <div className="text-green-100 text-sm md:text-base">Brands</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-orange-400">
                    20+
                  </div>
                  <div className="text-green-100 text-sm md:text-base">Years Online</div>
                </div>
              </div>
            </div>

            {/* Right Side - Tractor Visual (placeholder) */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-800/20 to-transparent" />
              </div>
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
                    imageUrl={tractor.imageUrl}
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

      {/* Brands Section - Estilo TractorData.es */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Agricultural Tractors</h2>
            <Link href="/marcas" className="text-gray-500 hover:text-primary-600 font-semibold">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mainBrands.map((brand) => {
              const brandTractors = getTractorsByBrand(brand);
              const logoPath = getBrandLogo(brand);
              const brandColor = getBrandColor(brand);
              
              return (
                <Link
                  key={brand}
                  href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
                >
                  {/* Background Color */}
                  <div className={`${brandColor} p-6 text-white min-h-[140px] flex flex-col items-center justify-center transition-all group-hover:shadow-lg`}>
                    {/* Logo */}
                    <div className="mb-3 w-20 h-20 flex items-center justify-center bg-white rounded-lg p-2 shadow-md">
                      <BrandLogo
                        brandName={brand}
                        width={80}
                        height={80}
                        className="w-full h-full"
                      />
                    </div>
                    
                    {/* Brand Name (small) */}
                    <div className="text-sm font-semibold text-black mb-1 text-center">
                      {brand}
                    </div>
                    
                    {/* Model Count */}
                    <div className="text-xs text-white/70">
                      {brandTractors.length} {brandTractors.length === 1 ? 'model' : 'models'}
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* Agregar más marcas sin logo */}
            {brands.slice(mainBrands.length, mainBrands.length + 5).map((brand) => {
              const brandTractors = getTractorsByBrand(brand);
              const brandColor = getBrandColor(brand);
              
              return (
                <Link
                  key={brand}
                  href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
                >
                  <div className={`${brandColor} p-6 text-white min-h-[140px] flex flex-col items-center justify-center transition-all group-hover:shadow-lg`}>
                    <div className="mb-3 w-20 h-20 flex items-center justify-center bg-white rounded-lg p-2 shadow-md">
                      <BrandLogo
                        brandName={brand}
                        width={80}
                        height={80}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="text-sm font-semibold text-white/90 mb-1 text-center">
                      {brand}
                    </div>
                    <div className="text-xs text-white/70">
                      {brandTractors.length} {brandTractors.length === 1 ? 'model' : 'models'}
                    </div>
                  </div>
                </Link>
              );
            })}
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

