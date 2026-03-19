/**
 * Localized best-tractor category pages.
 * /en/best/[category]  and  /es/mejores/[category]
 *
 * 286 categories × 2 locales = 572 static SEO pages auto-generated from
 * pre-built data/indexes/best-{category}.json files.
 *
 * Top 20 categories are pre-built at deploy time via generateStaticParams();
 * all others are served on-demand via ISR (revalidate = 7 days).
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import {
  getBestCategoryBySlug,
  getBestCategorySlugs,
  type BestIndexFile,
  type BestIndexItem,
} from '@/lib/bestCategories';
import { tryParseJson } from '@/lib/tractorFit/utils';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { pathForLocale, getCanonicalUrl } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';
const INDEXES_DIR = path.join(process.cwd(), 'data', 'indexes');

// ISR: regenerate at most once every 7 days (category rankings change rarely).
export const revalidate = 604800; // 7 days
export const dynamicParams = true;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadBestIndex(category: string): BestIndexFile | null {
  const filePath = path.join(INDEXES_DIR, `best-${category}.json`);
  try {
    if (!fs.existsSync(filePath)) return null;
    return tryParseJson<BestIndexFile>(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function fillTemplate(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  }
  return out;
}

function formatStat(value: number | null): string {
  return value != null ? String(value) : '—';
}

/** Slugify a category slug into a human-readable title (fallback). */
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getBestPicks(items: BestIndexItem[]): {
  topOverall: BestIndexItem;
  topValue: BestIndexItem;
  lightest: BestIndexItem;
} {
  const topOverall = items[0]!;
  const topValue = items.reduce((best, i) =>
    i.overallScore > best.overallScore ? i : best, items[0]!);
  const lightest = items.reduce((best, i) => {
    const w = i.weightKg ?? Infinity;
    const b = best.weightKg ?? Infinity;
    return w < b ? i : best;
  }, items[0]!);
  return { topOverall, topValue, lightest };
}

// ---------------------------------------------------------------------------
// Static params — pre-build top 20 known categories × 2 locales
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getBestCategorySlugs().map((category) => ({ locale, category }))
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const loc = locale as Locale;
  const config = getBestCategoryBySlug(category);
  const title = config ? config.title : slugToTitle(category);
  const isEs = loc === 'es';

  const metaTitle = isEs
    ? `${title} | Comparativa ${new Date().getFullYear()} | TractorsCompare`
    : `${title} (${new Date().getFullYear()}) | TractorsCompare`;

  const data = loadBestIndex(category);
  const count = data?.items?.length ?? 20;
  const medianHP = data?.stats?.medianHP;

  const metaDescription = isEs
    ? `Los ${count} mejores tractores para ${title.toLowerCase()} según el análisis TractorFit™. ${medianHP ? `Potencia media ${medianHP} CV.` : ''} Compara especificaciones y encuentra el mejor tractor.`
    : `The top ${count} tractors for ${title.toLowerCase()} ranked by TractorFit™. ${medianHP ? `Median engine power ${medianHP} HP.` : ''} Compare specs and find the best option.`;

  const canonicalUrl = `${SITE_URL}${pathForLocale('best/' + category, loc)}`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}${pathForLocale('best/' + category, 'en')}`,
        es: `${SITE_URL}${pathForLocale('best/' + category, 'es')}`,
        'x-default': `${SITE_URL}${pathForLocale('best/' + category, 'en')}`,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function LocalizedBestCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const loc = locale as Locale;
  const isEs = loc === 'es';

  const config = getBestCategoryBySlug(category);
  const data = loadBestIndex(category);

  // Need at least index data to render the page
  if (!data || !data.items?.length) notFound();

  const { items, stats } = data;
  const hpValues = items.map((i) => i.hp).filter((n): n is number => n != null);
  const minHp = hpValues.length ? Math.min(...hpValues) : null;
  const maxHp = hpValues.length ? Math.max(...hpValues) : null;

  const vars: Record<string, string | number> = {
    count: stats.count,
    medianHP: formatStat(stats.medianHP),
    medianWeightKg: formatStat(stats.medianWeightKg),
    medianPtoHP: formatStat(stats.medianPtoHP),
    medianPowerToWeight: formatStat(stats.medianPowerToWeight),
    ptoCoveragePct: stats.ptoCoveragePct,
    minHp: minHp != null ? minHp : '—',
    maxHp: maxHp != null ? maxHp : '—',
  };

  const pageTitle = config ? config.title : slugToTitle(category);

  const intro = config
    ? fillTemplate(config.introTemplate, vars)
    : isEs
      ? `Los ${items.length} mejores tractores de la categoría "${pageTitle}" según el análisis TractorFit™. Potencia media ${formatStat(stats.medianHP)} CV.`
      : `The top ${items.length} tractors for "${pageTitle}" ranked by TractorFit™ engine scores. Median power ${formatStat(stats.medianHP)} HP.`;

  const methodologyBullets = config?.methodologyBullets ?? [
    'Rankings use TractorFit™ scores derived from manufacturer specifications.',
    'Top 20 are selected deterministically; no randomness.',
  ];

  const faqs = (config?.faqTemplates ?? []).map((faq) => ({
    q: faq.q,
    a: fillTemplate(faq.a, vars),
  }));

  const picks = getBestPicks(items);

  const modelFromName = (name: string, brand: string) =>
    name.replace(new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`), '').trim() || '—';

  const pageUrl = `${SITE_URL}${pathForLocale('best/' + category, loc)}`;

  // JSON-LD schemas
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isEs ? 'Inicio' : 'Home', item: `${SITE_URL}/${loc}` },
      { '@type': 'ListItem', position: 2, name: isEs ? 'Mejores tractores' : 'Best Tractors', item: `${SITE_URL}${pathForLocale('best', loc)}` },
      { '@type': 'ListItem', position: 3, name: pageTitle, item: pageUrl },
    ],
  };

  const faqLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }
    : null;

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: `${SITE_URL}${pathForLocale('tractors/' + entry.slug, loc)}`,
    })),
  };

  // UI string labels
  const ui = {
    home: isEs ? 'Inicio' : 'Home',
    tractors: isEs ? 'Tractores' : 'Tractors',
    bestTractors: isEs ? 'Mejores tractores' : 'Best Tractors',
    howWeRank: isEs ? 'Cómo clasificamos los tractores en esta lista' : 'How we rank tractors for this list',
    statsSnapshot: isEs ? 'Estadísticas de la categoría' : 'Category stats snapshot',
    statsNote: isEs
      ? `Medianas y cobertura TDF de los ${items.length} mejores tractores de esta lista.`
      : `Medians and PTO coverage from the top ${items.length} tractors in this list.`,
    medianPower: isEs ? 'Potencia media del motor' : 'Median engine power',
    medianWeight: isEs ? 'Peso medio' : 'Median weight',
    medianPto: isEs ? 'Potencia TDF media' : 'Median PTO power',
    medianPtw: isEs ? 'Potencia/peso media' : 'Median power-to-weight',
    ptoCoverage: isEs ? 'Cobertura TDF' : 'PTO coverage',
    hpRange: isEs ? 'Rango de potencia' : 'HP range',
    topTractors: isEs ? `Mejores ${items.length} tractores` : `Top ${items.length} tractors`,
    bestPicks: isEs ? 'Mejores selecciones por escenario' : 'Best picks by scenario',
    topOverall: isEs ? 'Mejor global' : 'Top overall',
    topValue: isEs ? 'Mejor puntuación global' : 'Top value (highest overall score)',
    lightest: isEs ? 'Más ligero' : 'Lightest',
    faqs: isEs ? 'Preguntas frecuentes' : 'FAQs',
    viewAnalysis: isEs ? 'Ver análisis TractorFit™ →' : 'View TractorFit™ analysis →',
    conclusion: isEs
      ? 'Todas las puntuaciones provienen del motor TractorFit™ usando solo datos del fabricante. Recomendamos consultar las páginas individuales de cada tractor para obtener las especificaciones completas y resúmenes de expertos.'
      : 'All scores come from the TractorFit™ engine using manufacturer data only. We recommend comparing individual tractor pages for full specs and expert summaries.',
    browsMore: isEs ? 'Explorar más categorías' : 'Browse more categories',
  };

  // Other categories for cross-linking
  const otherSlugs = getBestCategorySlugs().filter((c) => c !== category).slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, itemListLd]) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <main className="container-custom py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600" aria-label="breadcrumb">
          <Link href={`/${loc}`} className="hover:text-primary-600">{ui.home}</Link>
          <span className="mx-2" aria-hidden>/</span>
          <Link href={pathForLocale('tractors', loc)} className="hover:text-primary-600">{ui.tractors}</Link>
          <span className="mx-2" aria-hidden>/</span>
          <span className="text-gray-900">{pageTitle}</span>
        </nav>

        {/* H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl">{intro}</p>

        {/* How we rank */}
        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">{ui.howWeRank}</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1 max-w-3xl mb-6">
          {methodologyBullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>

        {/* Stats snapshot */}
        <section className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">{ui.statsSnapshot}</h2>
          <p className="text-gray-700 text-sm mb-2">{ui.statsNote}</p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 text-sm">
            <li>{ui.medianPower}: <strong>{formatStat(stats.medianHP)} HP</strong></li>
            <li>{ui.medianWeight}: <strong>{formatStat(stats.medianWeightKg)} kg</strong></li>
            <li>{ui.medianPto}: <strong>{formatStat(stats.medianPtoHP)} HP</strong></li>
            <li>{ui.medianPtw}: <strong>{formatStat(stats.medianPowerToWeight)} HP/t</strong></li>
            <li>{ui.ptoCoverage}: <strong>{stats.ptoCoveragePct}%</strong></li>
            {minHp != null && maxHp != null && (
              <li>{ui.hpRange}: <strong>{minHp}–{maxHp} HP</strong></li>
            )}
          </ul>
        </section>

        {/* Tractor list */}
        <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">{ui.topTractors}</h2>
        <ul className="space-y-6">
          {items.map((entry, i) => {
            const tractorUrl = pathForLocale('tractors/' + entry.slug, loc);
            return (
              <li key={entry.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-gray-100">
                    <TractorImagePlaceholder
                      brand={entry.brand}
                      model={modelFromName(entry.name, entry.brand)}
                      alt={`${entry.name} tractor specs`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900">
                      <Link href={tractorUrl} className="hover:text-primary-600">
                        {entry.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {entry.hp != null && `${entry.hp} HP`}
                      {entry.hp != null && entry.ptoHP != null && ' · '}
                      {entry.ptoHP != null && `${entry.ptoHP} HP PTO`}
                      {(entry.hp != null || entry.ptoHP != null) && ' · '}
                      Overall {entry.overallScore}/100 · Category {entry.categoryScore}/100
                    </p>
                    <ul className="mt-3 space-y-1 text-gray-700 text-sm">
                      {entry.reasons.map((r, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-primary-600 shrink-0">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={tractorUrl} className="inline-block mt-2 text-primary-600 font-medium hover:underline">
                      {ui.viewAnalysis}
                    </Link>
                  </div>
                  <div className="text-right text-gray-500 text-sm shrink-0">#{i + 1}</div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Best picks by scenario */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">{ui.bestPicks}</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>{ui.topOverall}:</strong>{' '}
              <Link href={pathForLocale('tractors/' + picks.topOverall.slug, loc)} className="text-primary-600 hover:underline">
                {picks.topOverall.name}
              </Link>
              {picks.topOverall.hp != null && ` (${picks.topOverall.hp} HP)`}
            </li>
            <li>
              <strong>{ui.topValue}:</strong>{' '}
              <Link href={pathForLocale('tractors/' + picks.topValue.slug, loc)} className="text-primary-600 hover:underline">
                {picks.topValue.name}
              </Link>
              {picks.topValue.hp != null && ` (${picks.topValue.hp} HP, overall ${picks.topValue.overallScore}/100)`}
            </li>
            <li>
              <strong>{ui.lightest}:</strong>{' '}
              <Link href={pathForLocale('tractors/' + picks.lightest.slug, loc)} className="text-primary-600 hover:underline">
                {picks.lightest.name}
              </Link>
              {picks.lightest.weightKg != null && ` (${picks.lightest.weightKg} kg)`}
            </li>
          </ul>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{ui.faqs}</h2>
            <ul className="space-y-4">
              {faqs.map((faq, i) => (
                <li key={i}>
                  <h3 className="font-medium text-gray-900">{faq.q}</h3>
                  <p className="text-gray-700 text-sm mt-1">{faq.a}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Conclusion */}
        <p className="mt-10 text-gray-600 max-w-3xl">{ui.conclusion}</p>

        {/* Cross-links to other categories */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{ui.browsMore}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {otherSlugs.map((slug) => {
              const other = getBestCategoryBySlug(slug);
              if (!other) return null;
              return (
                <Link
                  key={slug}
                  href={pathForLocale('best/' + slug, loc)}
                  className="text-primary-600 hover:underline font-medium text-sm"
                >
                  {other.title}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
