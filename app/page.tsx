import Link from 'next/link';
import { TrendingUp, Search, GitCompare } from 'lucide-react';
import { getAllBrands, tractors } from '@/data/tractors';
import { AdInContent } from '@/components/AdSense';
import NewsSections from '@/components/NewsSections';
import newsData from '@/data/news.json';
import PopularTractorsSection from '@/components/PopularTractorsSection';
import TractorsSection from '@/components/TractorsSection';

export const metadata = {
  title: 'Compare Tractors – Specifications, Comparisons & Technical Data | TractorsCompare',
  description: 'Compare agricultural tractor specifications by brand, power, price and features. Complete database with over 18,000 tractors. Compare John Deere, Kubota, New Holland, Case IH and more.',
  keywords: ['compare tractors', 'tractor specifications', 'tractor specs', 'best agricultural tractors', 'tractor comparison', 'tractor comparisons', 'tractor technical data', 'tractor database', 'tractor specifications', 'compare tractor specifications'],
};

export default function HomePage() {
  const brands = getAllBrands();

  // Tractores más populares (por potencia y disponibilidad de imagen)
  const popularTractors = tractors
    .filter(t => t.type === 'farm' && (t.engine?.powerHP || 0) > 100)
    .sort((a, b) => {
      // Priorizar tractores con imagen
      const aHasImage = a.imageUrl ? 1 : 0;
      const bHasImage = b.imageUrl ? 1 : 0;
      if (bHasImage !== aHasImage) return bHasImage - aHasImage;
      // Luego por potencia
      return (b.engine?.powerHP || 0) - (a.engine?.powerHP || 0);
    })
    .slice(0, 5); // Top 5 tractores populares

  return (
    <>
      {/* Hero Section with Banner Image */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden min-h-[600px] md:min-h-[700px]">
        {/* Background Image with Effects */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/banner.jpg"
            alt="John Deere tractor in agricultural field"
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              filter: 'brightness(0.65) saturate(1.2) contrast(1.15)',
              transform: 'scale(1.05)',
            }}
          />
          {/* Animated gradient overlay with depth */}
          <div 
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.75) 0%, rgba(22, 101, 52, 0.65) 50%, rgba(21, 128, 61, 0.75) 100%)',
            }}
          />
          {/* Additional depth overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Subtle animated shimmer effect */}
          <div 
            className="absolute inset-0 opacity-0 md:opacity-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
              animation: 'shimmer 6s ease-in-out infinite',
              width: '200%',
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            {/* Text Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
                Agricultural Tractor Comparison
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/95 leading-relaxed drop-shadow-lg">
                Compare specifications of over 18,000 agricultural, lawn and industrial tractors. 
                Find the perfect tractor by comparing power, engine, transmission and technical features.
              </p>

              {/* Statistics */}
              <div className="flex flex-wrap gap-6 md:gap-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-5 shadow-xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                    {tractors.length.toLocaleString()}
                  </div>
                  <div className="text-gray-800 text-sm md:text-base font-semibold">Tractors</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-5 shadow-xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                    {brands.length}+
                  </div>
                  <div className="text-gray-800 text-sm md:text-base font-semibold">Brands</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            className="w-full h-20 md:h-28"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"
              fill="white"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </section>

      {/* Los Más Populares Section */}
      <PopularTractorsSection tractors={popularTractors} />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TractorsCompare?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The most comprehensive tractor database with powerful comparison tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Search by Brand and Model</h3>
              <p className="text-gray-600 leading-relaxed">
                Find tractors by brand, model, power, type or any technical specification with our advanced search.
              </p>
            </div>
            <div className="text-center group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <GitCompare className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Compare Technical Specifications</h3>
              <p className="text-gray-600 leading-relaxed">
                Compare multiple tractors side by side: HP, engine, PTO, transmission and all technical features.
              </p>
            </div>
            <div className="text-center group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Best Tractors 2026 by Category</h3>
              <p className="text-gray-600 leading-relaxed">
                Accurate and up-to-date information on all available tractor models with detailed specifications.
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

      {/* Tractores por Marca - Nuevo Layout con Sidebar */}
      <TractorsSection />

      {/* Noticias (antes del footer) */}
      <NewsSections items={(newsData as any).items || []} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to find your ideal tractor?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Explore our complete database and compare models to make the best decision.
          </p>
          <Link 
            href="/tractores-agricolas" 
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 hover:bg-gray-50 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Get Started
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

    </>
  );
}

