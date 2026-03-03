import LocaleLink from '@/components/LocaleLink';
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
import type { Locale } from '@/lib/i18n/config';
import { pathForLocale } from '@/lib/i18n/routes';
import { t } from '@/lib/i18n/t';

const NewsSectionsLazy = dynamic(() => import('@/components/NewsSections'), {
  loading: () => (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <SkeletonGrid count={3} columns={3} />
      </div>
    </section>
  ),
});

const TractorsSectionLazy = dynamic(() => import('@/components/TractorsSection'), {
  loading: () => (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <SkeletonGrid count={6} columns={3} />
      </div>
    </section>
  ),
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    title: t('home.title', undefined, loc),
    description: t('home.description', undefined, loc),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;
  const brands = getAllBrands();

  return (
    <>
      <section className="relative text-white py-12 md:py-20 lg:py-32 overflow-hidden min-h-[400px] md:min-h-[600px] lg:min-h-[700px]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner.webp"
            alt="John Deere tractor in agricultural field"
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{ filter: 'brightness(0.65) saturate(1.2) contrast(1.15)', transform: 'scale(1.05)' }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-2xl">
                Tractor Data & Specifications Database
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/95 leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
                Compare tractors by specifications, performance, engine, transmission, PTO, hydraulic system, horsepower, weight, and dimensions. Complete tractor data for over 18,000 models from all major brands.
              </p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-5 shadow-xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">18,000+</div>
                  <div className="text-gray-800 text-sm md:text-base font-semibold">Tractors</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-5 shadow-xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">{brands.length}+</div>
                  <div className="text-gray-800 text-sm md:text-base font-semibold">Brands</div>
                </div>
              </div>
            </div>
            <TractorSearchHero />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="w-full h-20 md:h-28" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What is TractorsCompare?</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              TractorsCompare is a free tractor specifications database that helps farmers, landowners, and buyers compare thousands of tractor models by engine power, transmission, PTO, hydraulics, weight, and dimensions.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Use the search above to find a specific model, browse by <LocaleLink locale={loc} logicalPath="brands" className="text-primary-600 hover:text-primary-700 font-semibold underline">brand</LocaleLink> or <LocaleLink locale={loc} logicalPath="tractors" className="text-primary-600 hover:text-primary-700 font-semibold underline">category</LocaleLink>, or head to our <LocaleLink locale={loc} logicalPath="best" className="text-primary-600 hover:text-primary-700 font-semibold underline">Best Tractors</LocaleLink> section.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our <LocaleLink locale={loc} logicalPath="methodology" className="text-primary-600 hover:text-primary-700 font-semibold underline">methodology</LocaleLink> page explains how we compute scores and rankings.
            </p>
          </div>
        </div>
      </section>

      <PopularTractorsSection />
      <Suspense fallback={<section className="py-12 bg-white"><div className="container-custom"><SkeletonGrid count={6} columns={3} /></div></section>}>
        <TractorsSectionLazy />
      </Suspense>
      <HomeBrowseByBrand brands={brands} locale={loc} />
      <HomeBrowseByType locale={loc} />
      <HomeCompareBySpecs locale={loc} />
      <HomeNewsGuides locale={loc} />

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose TractorsCompare?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The most comprehensive tractor database with powerful comparison tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6"><Search className="w-10 h-10 text-primary-600" /></div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Search by Brand and Model</h3>
              <p className="text-gray-600 leading-relaxed">Find tractors by brand, model, power, type or any technical specification with our advanced search.</p>
            </div>
            <div className="text-center group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6"><GitCompare className="w-10 h-10 text-primary-600" /></div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Compare Technical Specifications</h3>
              <p className="text-gray-600 leading-relaxed">Compare multiple tractors side by side: HP, engine, PTO, transmission and all technical features.</p>
            </div>
            <div className="text-center group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6"><TrendingUp className="w-10 h-10 text-primary-600" /></div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Best Tractors 2026 by Category</h3>
              <p className="text-gray-600 leading-relaxed">Accurate and up-to-date information on all available tractor models with detailed specifications.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <AdInContent />
        </div>
      </section>

      <NewsSectionsLazy items={[]} />

      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Complete Tractor Specifications and Technical Data Database</h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              TractorsCompare provides comprehensive tractor data and detailed specifications for over 18,000 tractor models from major manufacturers.
            </p>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4 md:p-6 mt-6 md:mt-8 border border-primary-200">
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Need Help Finding the Right Tractor?</h4>
              <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
                Visit our <LocaleLink locale={loc} logicalPath="specs" className="text-primary-600 hover:text-primary-700 font-semibold underline">specifications glossary</LocaleLink>, check our <LocaleLink locale={loc} logicalPath="news" className="text-primary-600 hover:text-primary-700 font-semibold underline">news and guides</LocaleLink>, or <LocaleLink locale={loc} logicalPath="contact" className="text-primary-600 hover:text-primary-700 font-semibold underline">contact us</LocaleLink>.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:mt-4">
                <LocaleLink locale={loc} logicalPath="best" className="inline-flex items-center px-3 md:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-xs md:text-sm font-semibold">Best Tractors</LocaleLink>
                <LocaleLink locale={loc} logicalPath="compare" className="inline-flex items-center px-3 md:px-4 py-2 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-xs md:text-sm font-semibold">Compare Models</LocaleLink>
                <LocaleLink locale={loc} logicalPath="brands" className="inline-flex items-center px-3 md:px-4 py-2 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-xs md:text-sm font-semibold">All Brands</LocaleLink>
                <LocaleLink locale={loc} logicalPath="specs" className="inline-flex items-center px-3 md:px-4 py-2 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-xs md:text-sm font-semibold">Specifications Guide</LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="container-custom text-center relative z-10 px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6">Ready to find your ideal tractor?</h2>
          <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">Explore our complete database and compare models to make the best decision.</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <LocaleLink locale={loc} logicalPath="agricultural-tractors" className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-white text-primary-600 hover:bg-gray-50 rounded-xl font-semibold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Browse Database <span className="ml-2">→</span>
            </LocaleLink>
            <LocaleLink locale={loc} logicalPath="compare" className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105">
              <GitCompare className="w-4 h-4 md:w-5 md:h-5" /> Compare Tractors
            </LocaleLink>
            <LocaleLink locale={loc} logicalPath="contact" className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105">
              <Mail className="w-4 h-4 md:w-5 md:h-5" /> Get Help
            </LocaleLink>
          </div>
        </div>
      </section>
    </>
  );
}
