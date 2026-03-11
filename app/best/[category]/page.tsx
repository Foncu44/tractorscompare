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

const DATA_DIR = path.join(process.cwd(), 'data');
const INDEXES_DIR = path.join(DATA_DIR, 'indexes');
const SITE_URL = 'https://tractorscompare.com';

function loadBestIndex(category: string): BestIndexFile | null {
  const filePath = path.join(INDEXES_DIR, `best-${category}.json`);
  try {
    if (!fs.existsSync(filePath)) return null;
    return tryParseJson<BestIndexFile>(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function fillTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  }
  return out;
}

function formatStat(value: number | null): string {
  return value != null ? String(value) : '—';
}

/** Derive top overall, top value (max overallScore in list), and lightest from items. */
function getBestPicks(items: BestIndexItem[]): {
  topOverall: BestIndexItem;
  topValue: BestIndexItem;
  lightest: BestIndexItem;
} {
  if (items.length === 0) throw new Error('items must be non-empty');
  const topOverall = items[0]!;
  const topValue = items.reduce((best, i) =>
    i.overallScore > best.overallScore ? i : best
  , items[0]!);
  const lightest = items.reduce((best, i) => {
    const w = i.weightKg ?? Infinity;
    const b = best.weightKg ?? Infinity;
    return w < b ? i : best;
  }, items[0]!);
  return { topOverall, topValue, lightest };
}

export async function generateStaticParams() {
  return getBestCategorySlugs().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const config = getBestCategoryBySlug(category);
  if (!config) return { title: 'Best Tractors | TractorsCompare' };
  const description = fillTemplate(config.introTemplate, {
    count: 20,
    medianHP: '—',
    medianWeightKg: '—',
    medianPtoHP: '—',
    medianPowerToWeight: '—',
    ptoCoveragePct: '—',
    minHp: '—',
    maxHp: '—',
  }).slice(0, 160);
  return {
    title: `${config.title} | TractorsCompare`,
    description,
    alternates: { canonical: `${SITE_URL}/best/${category}` },
  };
}

export default async function BestCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const config = getBestCategoryBySlug(category);
  if (!config) notFound();

  const data = loadBestIndex(category);
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
  const intro = fillTemplate(config.introTemplate, vars);
  const methodologyBullets = config.methodologyBullets;
  const faqs = config.faqTemplates.map((faq) => ({
    q: faq.q,
    a: fillTemplate(faq.a, vars),
  }));

  const conclusion =
    'All scores and reasons come from the TractorFit™ engine using manufacturer data only. See our Methodology page for how each score is calculated. We recommend comparing individual tractor pages for full specs and expert summaries.';

  const otherSlugs = getBestCategorySlugs().filter((c) => c !== category);
  const picks = getBestPicks(items);

  const modelFromName = (name: string, brand: string) =>
    name.replace(new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`), '').trim() || '—';

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tractors', item: `${SITE_URL}/tractores` },
      { '@type': 'ListItem', position: 3, name: config.title, item: `${SITE_URL}/best/${category}` },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.title,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      url: `${SITE_URL}/tractores/${entry.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, faqLd, itemListLd]) }} />
      <main className="container-custom py-8 md:py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tractores" className="hover:text-primary-600">Tractors</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Best: {config.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{config.title}</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl">{intro}</p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">How we rank tractors for this list</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1 max-w-3xl mb-6">
          {methodologyBullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>

        <section className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Category stats snapshot</h2>
          <p className="text-gray-700 text-sm mb-2">
            Medians and PTO coverage from the top {items.length} tractors in this list.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 text-sm">
            <li>Median engine power: <strong>{formatStat(stats.medianHP)} HP</strong></li>
            <li>Median weight: <strong>{formatStat(stats.medianWeightKg)} kg</strong></li>
            <li>Median PTO power: <strong>{formatStat(stats.medianPtoHP)} HP</strong></li>
            <li>Median power-to-weight: <strong>{formatStat(stats.medianPowerToWeight)} HP/t</strong></li>
            <li>PTO coverage: <strong>{stats.ptoCoveragePct}%</strong></li>
            {minHp != null && maxHp != null && (
              <li>HP range: <strong>{minHp}–{maxHp} HP</strong></li>
            )}
          </ul>
        </section>

        <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">Top {items.length} tractors</h2>
        <ul className="space-y-6">
          {items.map((entry, i) => (
            <li key={entry.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-gray-100">
                  <TractorImagePlaceholder
                    brand={entry.brand}
                    model={modelFromName(entry.name, entry.brand)}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <Link href={`/tractores/${entry.slug}`} className="hover:text-primary-600">
                      {entry.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {entry.hp != null && `${entry.hp} HP`}
                    {entry.hp != null && entry.ptoHP != null && ' · '}
                    {entry.ptoHP != null && `${entry.ptoHP} HP PTO`}
                    {(entry.hp != null || entry.ptoHP != null) && ' · '}
                    Overall {entry.overallScore}/100 · Category score {entry.categoryScore}/100
                  </p>
                  <ul className="mt-3 space-y-1 text-gray-700 text-sm">
                    {entry.reasons.map((r, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-primary-600 shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/tractores/${entry.slug}`}
                    className="inline-block mt-2 text-primary-600 font-medium hover:underline"
                  >
                    View TractorFit™ analysis →
                  </Link>
                </div>
                <div className="text-right text-gray-500 text-sm shrink-0">#{i + 1}</div>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Best picks by scenario</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              <strong>Top overall:</strong>{' '}
              <Link href={`/tractores/${picks.topOverall.slug}`} className="text-primary-600 hover:underline">
                {picks.topOverall.name}
              </Link>
              {picks.topOverall.hp != null && ` (${picks.topOverall.hp} HP)`}
            </li>
            <li>
              <strong>Top value (highest overall score in list):</strong>{' '}
              <Link href={`/tractores/${picks.topValue.slug}`} className="text-primary-600 hover:underline">
                {picks.topValue.name}
              </Link>
              {picks.topValue.hp != null && ` (${picks.topValue.hp} HP, overall ${picks.topValue.overallScore}/100)`}
            </li>
            <li>
              <strong>Lightest:</strong>{' '}
              <Link href={`/tractores/${picks.lightest.slug}`} className="text-primary-600 hover:underline">
                {picks.lightest.name}
              </Link>
              {picks.lightest.weightKg != null && ` (${picks.lightest.weightKg} kg)`}
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">FAQs</h2>
          <ul className="space-y-4">
            {faqs.map((faq, i) => (
              <li key={i}>
                <h3 className="font-medium text-gray-900">{faq.q}</h3>
                <p className="text-gray-700 text-sm mt-1">{faq.a}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-gray-600 max-w-3xl">{conclusion}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          {otherSlugs.map((slug) => {
            const other = getBestCategoryBySlug(slug);
            if (!other) return null;
            return (
              <Link
                key={slug}
                href={`/best/${slug}`}
                className="text-primary-600 hover:underline font-medium"
              >
                {other.title}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
