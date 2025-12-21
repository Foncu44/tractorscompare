import Link from 'next/link';
import { TrendingUp, Search, GitCompare } from 'lucide-react';
import { brandToSlug, getAllBrands, tractors } from '@/data/tractors';
import { AdInContent } from '@/components/AdSense';
import { getBrandColor, getBrandLogo } from '@/lib/brandLogos';
import NewsSections from '@/components/NewsSections';
import newsData from '@/data/news.json';
import BrandLogo from '@/components/BrandLogo';

export const metadata = {
  title: 'Tractor Data - Complete Tractor Specifications Database',
  description: 'Comprehensive tractor data and specifications database. Access detailed technical information for over 18,000 tractors from John Deere, Kubota, New Holland, Case IH and more. Compare specs, find tractor data, and make informed decisions.',
  keywords: ['tractor data', 'tractor specifications', 'tractor database', 'tractor data database', 'tractor specs', 'tractor information', 'tractor compare', 'agricultural tractors', 'john deere', 'kubota', 'new holland'],
};

export default function HomePage() {
  const brands = getAllBrands();

  // Top marcas por categoría (una sola pasada)
  const farmCounts = new Map<string, number>();
  const lawnCounts = new Map<string, number>();
  for (const t of tractors) {
    const type = (t.type || 'farm');
    if (type === 'farm') farmCounts.set(t.brand, (farmCounts.get(t.brand) || 0) + 1);
    if (type === 'lawn') lawnCounts.set(t.brand, (lawnCounts.get(t.brand) || 0) + 1);
  }

  const topFarmBrands = Array.from(farmCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([brand, count]) => ({ brand, count, slug: brandToSlug(brand), color: getBrandColor(brand) }));

  const topLawnBrands = Array.from(lawnCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([brand, count]) => ({ brand, count, slug: brandToSlug(brand), color: getBrandColor(brand) }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Most Complete Tractor Database
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                Detailed specifications for over 18,000 agricultural, garden, and industrial tractors. 
                Your definitive resource for machinery information.
              </p>

              {/* Statistics */}
              <div className="flex flex-wrap gap-8">
                <div style={{ backgroundColor: 'lightgray', padding: '30px' }}>
                  <div className="text-3xl md:text-4xl font-bold text-orange-500">
                    {tractors.length.toLocaleString()}
                  </div>
                  <div className="text-gray-800 text-sm md:text-base font-semibold">Tractors</div>
                </div>
                <div style={{ backgroundColor: 'lightgray', padding: '30px' }}>
                  <div className="text-3xl md:text-4xl font-bold text-orange-500">
                    {brands.length}+
                  </div>
                  <div className="text-gray-800 text-sm md:text-base font-semibold">Brands</div>
                </div>
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

      {/* AdSense Ad */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <AdInContent />
        </div>
      </section>

      {/* Tractores Agrícolas (como tu diseño) */}
      <section className="py-16 bg-[#fbf7f1]">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Agricultural Tractors</h2>
            <Link href="/tractores-agricolas" className="text-gray-700 hover:text-primary-700 font-semibold">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topFarmBrands.map(({ brand, count, slug, color }) => {
              const brandLogo = getBrandLogo(brand);
              return (
                <Link
                  key={brand}
                  href={`/marcas/${slug}?tipo=farm`}
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                >
                  <div className={`aspect-[4/3] ${color} rounded-lg mb-3 flex items-center justify-center overflow-hidden p-4`}>
                    <div className="w-full h-full flex items-center justify-center">
                      <BrandLogo 
                        brandName={brand} 
                        width={120} 
                        height={80}
                        className="max-w-full max-h-full"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {brand}
                  </h3>
                  <p className="text-sm text-gray-500">{count} models</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tractores de Jardín (como tu diseño) */}
      <section className="py-16 bg-[#fbf7f1]">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Lawn Tractors</h2>
            <Link href="/tractores-jardin" className="text-gray-700 hover:text-primary-700 font-semibold">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topLawnBrands.map(({ brand, count, slug, color }) => {
              const brandLogo = getBrandLogo(brand);
              return (
                <Link
                  key={brand}
                  href={`/marcas/${slug}?tipo=lawn`}
                  className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
                >
                  <div className={`aspect-[4/3] ${color} rounded-lg mb-3 flex items-center justify-center overflow-hidden p-4`}>
                    <div className="w-full h-full flex items-center justify-center">
                      <BrandLogo 
                        brandName={brand} 
                        width={120} 
                        height={80}
                        className="max-w-full max-h-full"
                      />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {brand}
                  </h3>
                  <p className="text-sm text-gray-500">{count} models</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Noticias (antes del footer) */}
      <NewsSections items={(newsData as any).items || []} />

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to find your ideal tractor?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Explore our complete database and compare models to make the best decision.
          </p>
          <Link href="/tractores-agricolas" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-block">
            Empezar
          </Link>
        </div>
      </section>

    </>
  );
}

