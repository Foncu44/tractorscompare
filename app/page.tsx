import Link from 'next/link';
import { TrendingUp, Search, GitCompare, Mail } from 'lucide-react';
import { getAllBrands } from '@/data/tractors';
import { AdInContent } from '@/components/AdSense';
import PopularTractorsSection from '@/components/PopularTractorsSection';
import TractorSearchHero from '@/components/TractorSearchHero';
import HomeBrowseByBrand from '@/components/HomeBrowseByBrand';
import HomeBrowseByType from '@/components/HomeBrowseByType';
import HomeCompareBySpecs from '@/components/HomeCompareBySpecs';
import HomeNewsGuides from '@/components/HomeNewsGuides';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { SkeletonList, SkeletonGrid } from '@/components/SkeletonLoader';

// Lazy load componentes pesados - Next 15: ssr: false no permitido en Server Components
const NewsSectionsLazy = dynamic(() => import('@/components/NewsSections'), {
  loading: () => (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <SkeletonGrid count={3} columns={3} />
      </div>
    </section>
  ),
});

// Lazy load TractorsSection para móvil - Carga después del contenido crítico
const TractorsSectionLazy = dynamic(() => import('@/components/TractorsSection'), {
  loading: () => (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <SkeletonGrid count={6} columns={3} />
      </div>
    </section>
  ),
});

export const metadata = {
  title: 'Tractor Data & Specifications Database | TractorsCompare',
  description: 'Compare 18,000+ tractors by brand, model, engine, transmission, PTO, and horsepower. Complete tractor specifications database with detailed technical data.',
  keywords: [
    'compare tractors',
    'tractor comparison',
    'tractor specifications',
    'tractor specs',
    'tractor database',
    'tractor technical data',
    'compare tractor models',
    'tractor comparison tool',
    'tractor specs comparison',
    'agricultural tractor data',
    'farm tractor specifications',
    'tractor data lookup',
    'tractor specs lookup',
    'john deere tractor data',
    'kubota tractor specifications',
    'new holland tractor specs',
    'case ih tractor data',
    'massey ferguson tractor specifications',
    'tractor horsepower',
    'tractor engine specifications',
    'tractor transmission specs',
    'tractor pto specifications',
    'tractor hydraulic system',
    'best agricultural tractors',
    'tractor buying guide',
    'tractor information',
    'tractor specifications database',
    'tractordata alternative',
    'tractor comparison website',
    'best tractor database',
  ],
};

export default function HomePage() {
  const brands = getAllBrands();

  return (
    <>
      {/* Hero Section with Banner Image */}
      <section className="relative text-white py-12 md:py-20 lg:py-32 overflow-hidden min-h-[400px] md:min-h-[600px] lg:min-h-[700px]">
        {/* Background Image with Effects */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/banner.webp"
            alt="John Deere tractor in agricultural field"
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              filter: 'brightness(0.65) saturate(1.2) contrast(1.15)',
              transform: 'scale(1.05)',
            }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width="1920"
            height="1080"
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
          <div className="max-w-4xl mx-auto">
            {/* Text Content */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
                Tractor Data & Specifications Database
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/95 leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
                Compare tractors by specifications, performance, engine, transmission, PTO, hydraulic system, horsepower, weight, and dimensions. Complete tractor data for over 18,000 models from all major brands.
              </p>

              {/* Statistics */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-5 shadow-xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                    18,000+
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

            {/* Search Hero */}
            <TractorSearchHero />
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

      {/* Most Popular Section */}
      <PopularTractorsSection />

      {/* Tractors by Brand - New Layout with Sidebar - Lazy loaded for mobile */}
      <Suspense fallback={
        <section className="py-12 bg-white">
          <div className="container-custom">
            <SkeletonGrid count={6} columns={3} />
          </div>
        </section>
      }>
        <TractorsSectionLazy />
      </Suspense>

      {/* Browse by Brand */}
      <HomeBrowseByBrand brands={brands} />

      {/* Browse by Type */}
      <HomeBrowseByType />

      {/* Compare by Specs */}
      <HomeCompareBySpecs />

      {/* News & Guides */}
      <HomeNewsGuides />

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

      {/* News (before footer) - Lazy loaded */}
      <NewsSectionsLazy items={[]} />

      {/* Comprehensive Content Section - SEO Optimization */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Complete Tractor Specifications and Technical Data Database
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              TractorsCompare provides comprehensive tractor data and detailed specifications for over 18,000 tractor models from major manufacturers including John Deere, Kubota, New Holland, Case IH, Massey Ferguson, McCormick, Fendt, and many others. Our extensive database includes agricultural tractors, utility tractors, compact tractors, lawn tractors, garden tractors, and mowers.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Understanding Tractor Specifications and Technical Data
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              When comparing tractors, understanding key specifications is essential. Engine specifications include power output measured in horsepower (HP), engine displacement, fuel type (typically diesel for agricultural models), compression ratio, and starter voltage. Transmission specifications cover the type of transmission system, number of forward and reverse gears, and PTO (Power Take-Off) specifications including PTO horsepower and RPM.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Hydraulic system specifications are crucial for evaluating a tractor's capability. These include hydraulic flow rate, rear lift capacity, and hydraulic pump specifications. Dimensions and weight specifications provide important information about a tractor's physical size, including length, width, height, wheelbase, front and rear tread width, and operating weight. These measurements help determine if a tractor will fit in storage areas, through gates, or on trailers for transportation.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Tractor Types and Categories
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Agricultural tractors are designed for farming operations and typically feature higher horsepower engines, robust transmissions, and heavy-duty hydraulic systems. Utility tractors offer versatility for various tasks on farms and rural properties. Compact tractors provide power in a smaller package, ideal for landscaping, small farms, and residential properties. Lawn tractors and garden tractors are designed for mowing and light-duty tasks, while mowers focus specifically on lawn maintenance.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Finding Tractor Information and Specifications
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Our tractor database allows you to search and filter tractors by brand, model, series, type, engine specifications, fuel type, power range, transmission type, PTO specifications, hydraulic capacity, dimensions, and weight. Whether you're looking for used tractors, comparing new tractor models, researching specifications for parts and attachments, or seeking dealer information, TractorsCompare provides comprehensive tractor data to help you make informed decisions.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Each tractor listing includes detailed technical specifications, performance data, engine information, transmission details, PTO and hydraulic specifications, dimensions, weight, tire options, production years, and available attachments. We also provide links to manufacturer websites, technical catalogs, operator manuals, service manuals, and parts catalogs when available.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Tractor Comparison and Selection Guide
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Use our comparison tool to evaluate multiple tractors side by side. Compare engine power, transmission options, PTO horsepower, hydraulic system capacity, rear lift capacity, dimensions, weight, and price. This comprehensive comparison helps you identify the best tractor for your specific needs, whether for agricultural use, landscaping, utility work, or lawn maintenance.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              When selecting a tractor, consider the type of work you'll perform, available space for storage and operation, required attachments and implements, fuel efficiency, maintenance requirements, and budget. Our database includes information about attachments, loaders, tools, and spare parts availability. Use our comprehensive comparison tools to evaluate different models based on your specific needs and requirements.
            </p>

            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 md:p-6 mt-6 md:mt-8 border border-primary-200">
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                Need Help Finding the Right Tractor?
              </h4>
              <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
                Browse our extensive database of tractor specifications, compare models, explore by brand or type, and access detailed technical data. Visit our <Link href="/specs" className="text-primary-600 hover:text-primary-700 font-semibold underline">specifications glossary</Link> to understand technical terms, check our <Link href="/news" className="text-primary-600 hover:text-primary-700 font-semibold underline">news and guides</Link> section for helpful articles, or <Link href="/contacto" className="text-primary-600 hover:text-primary-700 font-semibold underline">contact us</Link> with questions about specific tractor models or specifications. For additional resources, visit the <a href="https://www.asabe.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-semibold underline">American Society of Agricultural and Biological Engineers</a> for industry standards, or explore <a href="https://www.fao.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 font-semibold underline">FAO agricultural machinery resources</a> for global tractor information.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                <Link href="/comparar" className="inline-flex items-center px-3 md:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs md:text-sm font-semibold">
                  Compare Models
                </Link>
                <Link href="/marcas" className="inline-flex items-center px-3 md:px-4 py-2 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-xs md:text-sm font-semibold">
                  All Brands
                </Link>
                <Link href="/specs" className="inline-flex items-center px-3 md:px-4 py-2 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-xs md:text-sm font-semibold">
                  Specifications Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container-custom text-center relative z-10 px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6">
            Ready to find your ideal tractor?
          </h2>
          <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
            Explore our complete database and compare models to make the best decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link 
              href="/tractores-agricolas" 
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white text-primary-600 hover:bg-gray-50 rounded-xl font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Browse Database
              <span className="ml-2">→</span>
            </Link>
            <Link 
              href="/comparar" 
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105"
            >
              <GitCompare className="w-4 h-4 md:w-5 md:h-5" />
              Compare Tractors
            </Link>
            <Link 
              href="/contacto" 
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              Get Help
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}

