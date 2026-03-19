import { notFound } from 'next/navigation';
import Link from 'next/link';
import { brandToSlug, getTractorBySlug, tractors } from '@/data/tractors';
import { ArrowLeft, GitCompare } from 'lucide-react';
import type { Metadata } from 'next';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdSidebar } from '@/components/AdSense';
import TractorSpecsTabs from '@/components/TractorSpecsTabs';
import SEOContentSection from '@/components/SEOContentSection';
import UsedListingsInternational from '@/components/UsedListingsInternational';
import { specsFromTractor, computeSuitability } from '@/lib/tractorSuitability';
import { buildPerformanceProfile } from '@/lib/tractorIntelligence/profile';
import { buildTractorNarrative } from '@/lib/tractorNarrative';
import { estimateUsedPrice } from '@/lib/usedPriceEstimate';
import { narrativesMap } from '@/data/narratives-map';
import {
  buildTractorInsights,
  buildTabMeaningNotes,
  buildFaqs,
  getSimilarTractors,
  getBetterAlternatives,
  getHpBandHubSlug,
  getBestForSubheading,
} from '@/lib/tractorPageContent';
import { getBestCategoryConfig } from '@/lib/tractorIntelligence/seo/bestCategory';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuickFactsGrid from '@/components/QuickFactsGrid';
import TractorFitPanel from '@/components/TractorFitPanel';
import RealWorldInsights from '@/components/RealWorldInsights';
import UsedMarketInsights from '@/components/UsedMarketInsights';
import SimilarTractors from '@/components/SimilarTractors';
import TractorFaq from '@/components/TractorFaq';
import DataSourcesLinks from '@/components/DataSourcesLinks';
import TractorIntroParagraph from '@/components/TractorIntroParagraph';
import TractorProsConsSEO from '@/components/TractorProsConsSEO';
import TractorConclusion from '@/components/TractorConclusion';
import { getTractorImage } from '@/lib/tractorImages';
import { pathForLocale, getCanonicalUrl, getAlternates } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';
import {
  buildTractorMetadata,
  buildProductSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from '@/lib/tractorSeo';

interface TractorDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// ISR: regenerate individual tractor pages at most once per 30 days.
// Pages not pre-built are rendered on first request and then cached.
// This keeps build time manageable for 10,000+ tractors.
export const revalidate = 86400 * 30;

// Allow on-demand rendering for slugs not in generateStaticParams().
export const dynamicParams = true;

/** Pre-build the top 500 tractors (best data quality) at deploy time.
 *  All other tractors are served on first request via ISR. */
function getTopTractors() {
  return tractors
    .filter(
      (t) =>
        t.engine?.powerHP != null &&
        t.transmission?.type &&
        t.weight != null &&
        t.slug
    )
    .slice(0, 500);
}

export async function generateStaticParams() {
  const top = getTopTractors();
  return locales.flatMap((locale) => top.map((tractor) => ({ locale, slug: tractor.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tractor = getTractorBySlug(slug);

  if (!tractor) {
    return { title: 'Tractor not found' };
  }

  const loc = locale as Locale;
  const canonicalUrl = getCanonicalUrl('tractors/' + tractor.slug, loc);

  let alternateLanguages: Record<string, string> | undefined;
  try {
    alternateLanguages = getAlternates('tractors/' + tractor.slug, loc) as Record<string, string>;
  } catch {
    alternateLanguages = undefined;
  }

  const metadata = buildTractorMetadata(tractor, loc, canonicalUrl, alternateLanguages);

  // Merge any per-tractor custom keywords from the data layer
  if (tractor.metaKeywords?.length) {
    metadata.keywords = [
      ...(Array.isArray(metadata.keywords) ? metadata.keywords : []),
      ...tractor.metaKeywords,
    ];
  }

  return metadata;
}

export default async function TractorDetailPage({ params }: TractorDetailPageProps) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const tractor = getTractorBySlug(slug);

  if (!tractor) {
    notFound();
  }

  const typeLabel =
    tractor.type === 'farm' ? t('tractor.typeAgricultural', undefined, loc) :
    tractor.type === 'lawn' ? t('tractor.typeLawn', undefined, loc) :
    tractor.type === 'industrial' ? t('tractor.typeIndustrial', undefined, loc) :
    t('tractor.typeDefault', undefined, loc);

  const fullName = `${tractor.brand} ${tractor.model}`;
  const specs = specsFromTractor(tractor);
  const suitabilityResult = computeSuitability(specs, fullName);
  const profile = buildPerformanceProfile(tractor.id, fullName, specs, suitabilityResult);

  const usedEstimate = estimateUsedPrice({
    category: tractor.type === 'farm' ? 'Farm' : tractor.type === 'lawn' ? 'Lawn' : 'Industrial',
    powerHP: tractor.engine.powerHP,
    priceMin: tractor.priceRange?.min ?? null,
    priceMax: tractor.priceRange?.max ?? null,
  });

  const narrativeInput = {
    fullName,
    brandName: tractor.brand,
    modelName: tractor.model,
    category: tractor.type,
    hp: tractor.engine.powerHP,
    ptoHP: tractor.ptoHP ?? null,
    ptoRPM: tractor.ptoRPM ?? null,
    weightKg: tractor.weight ?? null,
    fuelType: tractor.engine.fuelType ?? null,
    cooling: tractor.engine.cooling ?? null,
    transmissionType: tractor.transmission?.type ?? null,
    priceMin: tractor.priceRange?.min ?? null,
    priceMax: tractor.priceRange?.max ?? null,
    usedMin: usedEstimate?.usedMin ?? null,
    usedMax: usedEstimate?.usedMax ?? null,
    suitability: {
      overallScore: suitabilityResult.overallScore,
      loaderWork: suitabilityResult.loaderScore,
      fuelEfficiency: suitabilityResult.fuelEfficiency,
      maintenance: suitabilityResult.maintenanceComplexity,
      versatility: suitabilityResult.versatilityIndex,
      costTier: suitabilityResult.costTier,
    },
  };
  const narrative =
    loc === 'es'
      ? buildTractorNarrative(narrativeInput, 'es')
      : (narrativesMap[tractor.slug] ?? buildTractorNarrative(narrativeInput, 'en'));

  const insights = buildTractorInsights(narrative);
  const tabMeaningNotes = buildTabMeaningNotes(tractor);
  const faqs = buildFaqs(tractor, suitabilityResult, usedEstimate, narrative);
  const similarTractors = getSimilarTractors(tractor, tractors, 6);
  const betterAlternatives = getBetterAlternatives(tractor, tractors, 4);
  const hpBandSlug = getHpBandHubSlug(tractor.engine.powerHP ?? 0);
  const hubLinks = hpBandSlug
    ? [
        { href: `/best/${hpBandSlug}`, label: getBestCategoryConfig(hpBandSlug)?.title ?? (tractor.engine.powerHP != null && tractor.engine.powerHP < 50 ? t('similar.bestCompactUnder50', undefined, loc) : t('similar.bestForYourSize', undefined, loc)) },
        { href: '/best/small-farm-tractors', label: t('similar.bestSmallFarm', undefined, loc) },
        { href: '/best/loader-tractors', label: t('similar.bestLoaderWork', undefined, loc) },
      ]
    : [
        { href: '/best/small-farm-tractors', label: t('similar.bestSmallFarm', undefined, loc) },
        { href: '/best/loader-tractors', label: t('similar.bestLoaderWork', undefined, loc) },
      ];
  const bestForLabels = getBestForSubheading(suitabilityResult);
  const bestForKeyMap: Record<string, string> = {
    'loader work': 'tractor.bestForLoaderWork',
    'small farms': 'tractor.bestForSmallFarms',
    'large farms': 'tractor.bestForLargeFarms',
    'fuel efficiency': 'tractor.bestForFuelEfficiency',
    versatility: 'tractor.bestForVersatility',
  };
  const bestForText = bestForLabels.length
    ? t('tractor.bestForPrefix', undefined, loc) + ' ' + bestForLabels.map((l) => t(bestForKeyMap[l] ?? l, undefined, loc)).join(t('tractor.bestForAnd', undefined, loc))
    : null;
  const subheadingParts = [typeLabel, tractor.engine.powerHP ? `${tractor.engine.powerHP} HP` : null, bestForText].filter(Boolean);

  const tractorImage = tractor.image ?? getTractorImage(tractor.slug);
  const displayImageUrl = tractorImage?.url ?? tractor.imageUrl;

  // ---------------------------------------------------------------------------
  // JSON-LD structured data
  // ---------------------------------------------------------------------------
  const pageUrl = getCanonicalUrl('tractors/' + tractor.slug, loc);

  const productSchema = buildProductSchema({
    tractor,
    imageUrl: displayImageUrl,
    pageUrl,
    locale: loc,
  });

  // BreadcrumbList
  const breadcrumbItems = [
    { name: 'Home', url: `https://tractorscompare.com/${loc}` },
    { name: tractor.brand, url: `https://tractorscompare.com${pathForLocale('brands/' + brandToSlug(tractor.brand), loc)}` },
    { name: fullName, url: pageUrl },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

  // FAQPage
  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      {/* Product schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* FAQPage schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen">
        <Breadcrumbs
          brandName={tractor.brand}
          brandSlug={brandToSlug(tractor.brand)}
          modelName={tractor.model}
          tractorSlug={tractor.slug}
          currentLabel={fullName + (tractor.productionYears ? ` (${tractor.productionYears.start}${tractor.productionYears.end && tractor.productionYears.end !== tractor.productionYears.start ? `-${tractor.productionYears.end}` : ''})` : tractor.year ? ` ${tractor.year}` : '')}
          locale={loc}
        />

        {/* ── Hero section ─────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-primary-50 to-gray-50 py-6 md:py-8 lg:py-12">
          <div className="container-custom">
            <Link href={pathForLocale('brands', loc)} className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-4 md:mb-6 transition-colors text-sm md:text-base">
              <ArrowLeft className="h-4 w-4" />
              <span>{t('tractor.backToBrands', undefined, loc)}</span>
            </Link>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              <div className="relative">
                <div className="aspect-[4/3] max-h-[280px] md:max-h-none rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                  <TractorImagePlaceholder
                    brand={tractor.brand}
                    model={tractor.model}
                    imageUrl={displayImageUrl}
                    alt={`${fullName} tractor specs`}
                    width={800}
                    height={600}
                    className="w-full h-full"
                  />
                </div>
                <span className="absolute top-2 left-2 md:top-4 md:left-4 inline-flex items-center rounded-full bg-primary-700 text-white px-2 md:px-3 py-1 text-xs font-semibold z-10">
                  {tractor.category || typeLabel}
                </span>
                {tractorImage && (
                  <p className="mt-2 text-xs text-gray-500 [&_a]:text-primary-600 [&_a]:hover:underline" dangerouslySetInnerHTML={{ __html: tractorImage.attributionHtml }} />
                )}
              </div>

              <div className="flex flex-col justify-center">
                <Link href={pathForLocale('brands/' + brandToSlug(tractor.brand), loc)} className="text-primary-700/ hover:text-primary-800 font-semibold mb-2 inline-block">
                  {tractor.brand}
                </Link>
                {/* H1: "[Brand] [Model] Specs, Price and Review (2026)" */}
                <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-3 break-words">
                  {fullName} {t('tractor.h1Suffix', undefined, loc)}
                </h1>
                {subheadingParts.length > 0 && (
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    {subheadingParts.join(' · ')}
                  </p>
                )}
                <QuickFactsGrid
                  locale={loc}
                  powerHP={tractor.engine.powerHP}
                  powerKW={tractor.engine.powerKW}
                  fuelType={tractor.engine.fuelType}
                  transmissionType={tractor.transmission?.type}
                  ptoHP={tractor.ptoHP}
                  ptoRPM={tractor.ptoRPM}
                  weightKg={tractor.weight}
                  priceMin={tractor.priceRange?.min}
                  priceMax={tractor.priceRange?.max}
                  usedMin={usedEstimate?.usedMin}
                  usedMax={usedEstimate?.usedMax}
                />
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6">
                  <Link href={`${pathForLocale('compare', loc)}?tractores=${tractor.id}`} className="flex-1">
                    <span className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm md:text-base">
                      <GitCompare className="h-4 w-4" />
                      {t('tractor.compare', undefined, loc)}
                    </span>
                  </Link>
                  <Link href={pathForLocale('brands/' + brandToSlug(tractor.brand), loc)} className="flex-1">
                    <span className="btn-primary w-full inline-flex items-center justify-center text-sm md:text-base">
                      {t('tractor.viewBrand', undefined, loc)}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-6 md:py-12">

          {/* ── Overview / Intro paragraph (SEO) ─────────────────── */}
          <TractorIntroParagraph tractor={tractor} locale={loc} />

          {/* ── TractorFit™ analysis ──────────────────────────────── */}
          <TractorFitPanel
            locale={loc}
            result={suitabilityResult}
            tractorName={fullName}
            fitInterpretation={insights.fitInterpretation}
            profile={{
              idealUseCase: profile.idealUseCase,
              maintenanceTier: profile.maintenanceTier,
              maintenanceTierDescription: profile.maintenanceTierDescription,
              operatingCostTier: profile.operatingCostTier,
              operatingCostTierDescription: profile.operatingCostTierDescription,
              expertSummary: profile.expertSummary,
            }}
          />

          {/* ── Real-world performance ────────────────────────────── */}
          <RealWorldInsights locale={loc} insights={insights} />

          {/* ── Pros and Cons (SEO featured snippet target) ──────── */}
          <TractorProsConsSEO
            pros={narrative.highlights}
            cons={narrative.tradeoffs}
            tractorName={fullName}
            locale={loc}
          />

          {/* ── Used market insights ──────────────────────────────── */}
          <UsedMarketInsights
            locale={loc}
            usedEstimate={usedEstimate ?? undefined}
            buyerChecklist={narrative.buyingTips}
            category={tractor.type}
            tractorName={fullName}
          />

          {/* ── Live marketplace listings ─────────────────────────── */}
          <UsedListingsInternational
            query={fullName.trim() || 'tractor'}
            brandName={tractor.brand}
            modelName={tractor.model}
          />

          {/* ── Main features list ────────────────────────────────── */}
          {tractor.features && tractor.features.length > 0 && (
            <div className="mt-8 md:mt-12 bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h2 className="text-xl font-bold mb-3 text-gray-900">{t('tractor.mainFeatures', undefined, loc)}</h2>
              <ul className="space-y-2">
                {tractor.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-700 mr-2 flex-shrink-0">✓</span>
                    <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Technical specifications ──────────────────────────── */}
          <div className="mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900">{t('tractor.technicalSpecs', undefined, loc)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <TractorSpecsTabs tractor={tractor} tabMeaningNotes={tabMeaningNotes} />
              </div>
              <div className="md:col-span-1">
                <div className="sticky top-20 md:top-24">
                  <AdSidebar />
                </div>
              </div>
            </div>
          </div>

          {/* ── Similar tractors + Better alternatives ────────────── */}
          <SimilarTractors locale={loc} similar={similarTractors} hubLinks={hubLinks} currentName={fullName} />

          {/* Better alternatives section */}
          {betterAlternatives.length > 0 && (
            <section
              className="mt-8 md:mt-10 bg-white rounded-xl border border-gray-200 p-4 md:p-6"
              aria-labelledby="better-alt-heading"
            >
              <h2 id="better-alt-heading" className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                {t('tractor.betterAlternativesTitle', undefined, loc)}
              </h2>
              <ul className="space-y-2">
                {betterAlternatives.map((alt) => (
                  <li key={alt.slug}>
                    <Link
                      href={pathForLocale('tractors/' + alt.slug, loc)}
                      className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium text-sm md:text-base"
                    >
                      <GitCompare className="h-4 w-4 flex-shrink-0" aria-hidden />
                      {alt.brand} {alt.model}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── FAQ ───────────────────────────────────────────────── */}
          <TractorFaq locale={loc} faqs={faqs} tractorSlug={tractor.slug} />

          {/* ── SEO content section (per-tractor custom content) ──── */}
          {tractor.seoContent && (
            <SEOContentSection content={tractor.seoContent} />
          )}

          {/* ── Conclusion ────────────────────────────────────────── */}
          <TractorConclusion
            tractor={tractor}
            suitabilityResult={suitabilityResult}
            bestFor={narrative.bestFor}
            locale={loc}
          />

          <DataSourcesLinks />
        </div>
      </div>
    </>
  );
}
