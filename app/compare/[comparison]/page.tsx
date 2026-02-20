import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTractorBySlug } from '@/data/tractors';
import { specsFromTractor, computeSuitability } from '@/lib/tractorSuitability';
import { generateComparePageContent } from '@/lib/tractorIntelligence/seo/compare';
import type { TractorCompareItem } from '@/lib/tractorIntelligence/seo/compare';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';

function parseComparisonSlug(comparison: string): { slugA: string; slugB: string } | null {
  const match = comparison.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  const slugA = match[1].trim().toLowerCase();
  const slugB = match[2].trim().toLowerCase();
  if (!slugA || !slugB) return null;
  return { slugA, slugB };
}

export async function generateStaticParams() {
  const { tractors } = await import('@/data/tractors');
  const slugs = tractors
    .filter((t) => t.slug && t.engine?.powerHP != null && t.transmission?.type)
    .map((t) => t.slug)
    .slice(0, 40);
  const params: { comparison: string }[] = [];
  for (let i = 0; i < slugs.length - 1; i += 2) {
    params.push({ comparison: `${slugs[i]}-vs-${slugs[i + 1]}` });
  }
  return params.slice(0, 25);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparison: string }>;
}): Promise<Metadata> {
  const { comparison } = await params;
  const parsed = parseComparisonSlug(comparison);
  if (!parsed) return { title: 'Compare Tractors | TractorsCompare' };

  const tractorA = getTractorBySlug(parsed.slugA);
  const tractorB = getTractorBySlug(parsed.slugB);
  if (!tractorA || !tractorB) return { title: 'Compare Tractors | TractorsCompare' };

  const suitA = computeSuitability(specsFromTractor(tractorA), `${tractorA.brand} ${tractorA.model}`);
  const suitB = computeSuitability(specsFromTractor(tractorB), `${tractorB.brand} ${tractorB.model}`);
  const content = generateComparePageContent(
    { id: tractorA.id, slug: tractorA.slug, brand: tractorA.brand, model: tractorA.model, suitability: suitA },
    { id: tractorB.id, slug: tractorB.slug, brand: tractorB.brand, model: tractorB.model, suitability: suitB }
  );
  return {
    title: content.title,
    description: content.metaDescription,
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ comparison: string }>;
}) {
  const { comparison } = await params;
  const parsed = parseComparisonSlug(comparison);
  if (!parsed) notFound();

  const tractorA = getTractorBySlug(parsed.slugA);
  const tractorB = getTractorBySlug(parsed.slugB);
  if (!tractorA || !tractorB) notFound();

  const specsA = specsFromTractor(tractorA);
  const specsB = specsFromTractor(tractorB);
  const suitA = computeSuitability(specsA, `${tractorA.brand} ${tractorA.model}`);
  const suitB = computeSuitability(specsB, `${tractorB.brand} ${tractorB.model}`);

  const itemA: TractorCompareItem = {
    id: tractorA.id,
    slug: tractorA.slug,
    brand: tractorA.brand,
    model: tractorA.model,
    suitability: suitA,
  };
  const itemB: TractorCompareItem = {
    id: tractorB.id,
    slug: tractorB.slug,
    brand: tractorB.brand,
    model: tractorB.model,
    suitability: suitB,
  };
  const content = generateComparePageContent(itemA, itemB);

  const scoreKeys = [
    { key: 'overallScore', label: 'Overall' },
    { key: 'smallFarmScore', label: 'Small farm' },
    { key: 'largeFarmScore', label: 'Large farm' },
    { key: 'loaderScore', label: 'Loader' },
    { key: 'fuelEfficiency', label: 'Fuel efficiency' },
    { key: 'versatilityIndex', label: 'Versatility' },
    { key: 'costTier', label: 'Cost tier' },
    { key: 'powerToWeightScore', label: 'Power-to-weight' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container-custom py-8 md:py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/comparar" className="hover:text-primary-600">Compare</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{content.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {content.title}
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl">{content.intro}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <TractorImagePlaceholder brand={tractorA.brand} model={tractorA.model} width={80} height={80} className="rounded" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{tractorA.brand} {tractorA.model}</h2>
                <Link href={`/tractores/${tractorA.slug}`} className="text-primary-600 text-sm hover:underline">View full specs →</Link>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              {scoreKeys.map(({ key, label }) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-gray-600">{label}</dt>
                  <dd className="font-medium">{String((suitA[key as keyof typeof suitA] as number) ?? 0) + '/100'}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <TractorImagePlaceholder brand={tractorB.brand} model={tractorB.model} width={80} height={80} className="rounded" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{tractorB.brand} {tractorB.model}</h2>
                <Link href={`/tractores/${tractorB.slug}`} className="text-primary-600 text-sm hover:underline">View full specs →</Link>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              {scoreKeys.map(({ key, label }) => (
                <div key={key} className="flex justify-between">
                  <dt className="text-gray-600">{label}</dt>
                  <dd className="font-medium">{String((suitB[key as keyof typeof suitB] as number) ?? 0) + '/100'}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Score summary</h3>
          <ul className="space-y-1 text-gray-700">
            {content.winnerByCategory.map((w) => (
              <li key={w.category}>{w.category}: {w.text}</li>
            ))}
          </ul>
        </div>

        <p className="text-gray-700 max-w-3xl">{content.summaryParagraph}</p>

        <p className="mt-8 text-sm text-gray-500">
          All scores from the TractorSuitability™ Engine. Compare more models in the <Link href="/comparar" className="text-primary-600 hover:underline">comparison tool</Link>.
        </p>
      </main>
    </div>
  );
}
