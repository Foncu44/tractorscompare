import LocaleLink from '@/components/LocaleLink';
import { TrendingUp, Search, GitCompare, Mail, ArrowRight, Zap, Database, BarChart3 } from 'lucide-react';
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
    <section className="py-12 bg-stone-50">
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
      {/* ═══════════════════════════════════════════════════════════
          HERO — full-bleed banner with grain overlay + bold type
      ════════════════════════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden min-h-[520px] md:min-h-[680px] lg:min-h-[740px]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner.webp"
            alt="Agricultural tractor working in a field"
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.55) saturate(1.1) contrast(1.15)',
              transform: 'scale(1.04)',
            }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            width={1920}
            height={1080}
          />
          {/* Multi-layer gradient for richness */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom flex flex-col justify-center min-h-[520px] md:min-h-[680px] lg:min-h-[740px] py-16 md:py-20">
          <div className="max-w-4xl mx-auto w-full">

            {/* Category badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Agricultural Intelligence Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold text-center leading-[1.1] mb-5 drop-shadow-lg">
              {t('home.heroTitle', undefined, loc)}
            </h1>

            {/* Subline */}
            <p className="text-center text-base md:text-xl text-white/85 leading-relaxed mb-10 max-w-2xl mx-auto drop-shadow">
              {t('home.heroSubline', undefined, loc)}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {[
                { value: '18,000+', label: t('home.statTractors', undefined, loc), icon: Database },
                { value: `${brands.length}+`,  label: t('home.statBrands',  undefined, loc), icon: BarChart3 },
                { value: '100%',   label: 'Free & Open Data',              icon: Zap },
              ].map(({ value, label, icon: Icon }) => (
                <div
                  key={value}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 shadow-lg"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-heading font-bold text-white leading-none">
                      {value}
                    </div>
                    <div className="text-xs md:text-sm text-white/70 font-medium mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search hero */}
            <TractorSearchHero />
          </div>
        </div>

        {/* Organic wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 wave-divider">
          <svg className="w-full" style={{ height: '60px' }} viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none">
            <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,10 1440,30 L1440,60 L0,60 Z" fill="#f9f7f4" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INTRO
      ════════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-surface-warm">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-5">
              {t('home.whatIsTitle', undefined, loc)}
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-4">
              {t('home.whatIsP1', undefined, loc)}
            </p>
            <p className="text-stone-600 text-lg leading-relaxed mb-4">
              {t('home.whatIsP2a', undefined, loc)}
              <LocaleLink locale={loc} logicalPath="brands" className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2 decoration-primary-300">
                {t('common.brand', undefined, loc)}
              </LocaleLink>
              {t('home.whatIsP2b', undefined, loc)}
              <LocaleLink locale={loc} logicalPath="tractors" className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2 decoration-primary-300">
                {t('common.category', undefined, loc)}
              </LocaleLink>
              {t('home.whatIsP2c', undefined, loc)}
              <LocaleLink locale={loc} logicalPath="best" className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2 decoration-primary-300">
                {t('home.linkBestTractors', undefined, loc)}
              </LocaleLink>
              {t('home.whatIsP2d', undefined, loc)}
            </p>
            <p className="text-stone-600 text-lg leading-relaxed">
              {t('home.whatIsP3before', undefined, loc)}
              <LocaleLink locale={loc} logicalPath="methodology" className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2 decoration-primary-300">
                {t('common.methodology', undefined, loc)}
              </LocaleLink>
              {t('home.whatIsP3after', undefined, loc)}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POPULAR + CATALOG SECTIONS
      ════════════════════════════════════════════════════════════ */}
      <PopularTractorsSection />
      <Suspense fallback={
        <section className="py-12 bg-white">
          <div className="container-custom">
            <SkeletonGrid count={6} columns={3} />
          </div>
        </section>
      }>
        <TractorsSectionLazy />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════
          BROWSE BY BRAND
      ════════════════════════════════════════════════════════════ */}
      <HomeBrowseByBrand brands={brands} locale={loc} />

      {/* ═══════════════════════════════════════════════════════════
          BROWSE BY TYPE
      ════════════════════════════════════════════════════════════ */}
      <HomeBrowseByType locale={loc} />

      {/* ═══════════════════════════════════════════════════════════
          WHY CHOOSE — 3-column feature cards
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-surface-warm">
        <div className="container-custom">
          {/* Section header */}
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              {t('home.whyChooseTitle', undefined, loc)}
            </h2>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
              {t('home.whyChooseSub', undefined, loc)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Search,
                title: t('home.searchCardTitle', undefined, loc),
                desc:  t('home.searchCardDesc',  undefined, loc),
                color: 'from-primary-500 to-primary-600',
                bg:    'bg-primary-50',
              },
              {
                icon: GitCompare,
                title: t('home.compareCardTitle', undefined, loc),
                desc:  t('home.compareCardDesc',  undefined, loc),
                color: 'from-amber-500 to-amber-600',
                bg:    'bg-amber-50',
              },
              {
                icon: TrendingUp,
                title: t('home.bestCardTitle', undefined, loc),
                desc:  t('home.bestCardDesc',  undefined, loc),
                color: 'from-primary-600 to-primary-800',
                bg:    'bg-primary-50',
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="group relative bg-white rounded-2xl p-8 border border-stone-100 hover:border-primary-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-bl-[3rem] opacity-60 transition-all duration-300 group-hover:opacity-100`} />

                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading text-xl font-bold text-stone-900 mb-3">{title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm md:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMPARE BY SPECS
      ════════════════════════════════════════════════════════════ */}
      <HomeCompareBySpecs locale={loc} />

      {/* ═══════════════════════════════════════════════════════════
          AD PLACEMENT
      ════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-stone-100/40">
        <div className="container-custom">
          <AdInContent />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEWS & GUIDES
      ════════════════════════════════════════════════════════════ */}
      <HomeNewsGuides locale={loc} />

      {/* ═══════════════════════════════════════════════════════════
          LONG-FORM SEO SECTION
      ════════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-5">
              {t('home.completeSpecsTitle', undefined, loc)}
            </h2>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-8">
              {t('home.completeSpecsP', undefined, loc)}
            </p>

            {/* Info box */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/60 rounded-2xl p-6 md:p-8 border border-primary-200/60">
              <h4 className="font-heading text-lg md:text-xl font-bold text-stone-900 mb-2">
                {t('home.needHelpTitle', undefined, loc)}
              </h4>
              <p className="text-stone-600 text-sm md:text-base mb-5 leading-relaxed">
                {t('home.needHelpP', undefined, loc)}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { path: 'best',    label: t('home.btnBestTractors', undefined, loc), primary: true  },
                  { path: 'compare', label: t('home.btnCompareModels', undefined, loc), primary: false },
                  { path: 'brands',  label: t('home.btnAllBrands',    undefined, loc), primary: false },
                  { path: 'specs',   label: t('home.btnSpecsGuide',   undefined, loc), primary: false },
                ].map(({ path, label, primary }) => (
                  <LocaleLink
                    key={path}
                    locale={loc}
                    logicalPath={path}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                      ${primary
                        ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
                        : 'bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 hover:border-primary-300'
                      }`}
                  >
                    {label}
                    {primary && <ArrowRight className="w-3.5 h-3.5" />}
                  </LocaleLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NEWS LAZY
      ════════════════════════════════════════════════════════════ */}
      <NewsSectionsLazy items={[]} />

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA BANNER
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 bg-primary-700 overflow-hidden text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary-600/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

        <div className="container-custom text-center relative z-10 px-4">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
            {t('home.ctaTitle', undefined, loc)}
          </h2>
          <p className="text-lg md:text-xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
            {t('home.ctaSub', undefined, loc)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <LocaleLink
              locale={loc}
              logicalPath="agricultural-tractors"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 hover:bg-primary-50 rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]"
            >
              {t('home.browseDatabase', undefined, loc)}
              <ArrowRight className="w-5 h-5" />
            </LocaleLink>
            <LocaleLink
              locale={loc}
              logicalPath="compare"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.03]"
            >
              <GitCompare className="w-5 h-5" />
              {t('home.compareTractorsBtn', undefined, loc)}
            </LocaleLink>
            <LocaleLink
              locale={loc}
              logicalPath="contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 rounded-xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.03]"
            >
              <Mail className="w-5 h-5" />
              {t('home.getHelp', undefined, loc)}
            </LocaleLink>
          </div>
        </div>
      </section>
    </>
  );
}
