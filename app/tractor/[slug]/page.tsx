import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import type { TractorFitJson } from '@/lib/tractorFit/types';
import { sanitizeTractorId, tryParseJson } from '@/lib/tractorFit/utils';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  FileText,
  HelpCircle,
  Home,
  Building2,
  Loader2,
  Fuel,
  Wrench,
  Layers,
  Zap,
} from 'lucide-react';

const DATA_DIR = path.join(process.cwd(), 'data');
const SLUGS_PATH = path.join(DATA_DIR, 'slugs.json');

function loadTractorBySlug(slug: string): TractorFitJson | null {
  try {
    if (!fs.existsSync(SLUGS_PATH)) return null;
    const slugsRaw = fs.readFileSync(SLUGS_PATH, 'utf-8');
    const slugsData = tryParseJson<{ slugToId?: Record<string, string> }>(slugsRaw);
    if (!slugsData?.slugToId) return null;
    const id = slugsData.slugToId[slug];
    if (!id) return null;
    const safeId = sanitizeTractorId(id);
    const tractorPath = path.join(DATA_DIR, 'tractors', `${safeId}.json`);
    if (!fs.existsSync(tractorPath)) return null;
    const tractorRaw = fs.readFileSync(tractorPath, 'utf-8');
    return tryParseJson<TractorFitJson>(tractorRaw);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    if (!fs.existsSync(SLUGS_PATH)) return [];
    const raw = fs.readFileSync(SLUGS_PATH, 'utf-8');
    const data = tryParseJson<{ entries?: { slug: string }[] }>(raw);
    const entries = data?.entries ?? [];
    return entries.map((e: { slug: string }) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tractor = loadTractorBySlug(slug);
  if (!tractor) return { title: 'Tractor Not Found | TractorsCompare' };
  const title = `${tractor.brand} ${tractor.model} – TractorFit™ Score & Specs`;
  const description = `${tractor.brand} ${tractor.model}: TractorFit™ overall ${tractor.tractorFit.overallScore}/100. ${tractor.specs.powerHP} HP, ${tractor.specs.transmissionType} transmission. Specs, pros, cons, and expert summary.`;
  return { title, description };
}

const SUB_SCORES: { key: keyof TractorFitJson['tractorFit']; label: string; icon: React.ReactNode }[] = [
  { key: 'smallFarmScore', label: 'Small farm', icon: <Home className="h-4 w-4" /> },
  { key: 'largeFarmScore', label: 'Large farm', icon: <Building2 className="h-4 w-4" /> },
  { key: 'loaderScore', label: 'Loader work', icon: <Loader2 className="h-4 w-4" /> },
  { key: 'fuelEfficiencyIndex', label: 'Fuel efficiency', icon: <Fuel className="h-4 w-4" /> },
  { key: 'maintenanceComplexity', label: 'Maintenance (higher = more complex)', icon: <Wrench className="h-4 w-4" /> },
  { key: 'versatilityIndex', label: 'Versatility', icon: <Layers className="h-4 w-4" /> },
  { key: 'powerToWeightScore', label: 'Power-to-weight', icon: <Zap className="h-4 w-4" /> },
];

export default async function TractorFitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tractor = loadTractorBySlug(slug);
  if (!tractor) notFound();

  const name = `${tractor.brand} ${tractor.model}`;
  const s = tractor.tractorFit;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container-custom py-6 md:py-10">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tractores" className="hover:text-primary-600">Tractors</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <TractorImagePlaceholder
              brand={tractor.brand}
              model={tractor.model}
              width={320}
              height={240}
              className="rounded-xl border border-gray-200"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
            <p className="text-gray-600 mb-4">
              {tractor.specs.powerHP} HP · {tractor.specs.fuelType} · {tractor.specs.transmissionType}
              {tractor.specs.weightKg != null && ` · ${Math.round(tractor.specs.weightKg / 1000)} t`}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 text-primary-800 px-4 py-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-bold text-xl">TractorFit™ {s.overallScore}</span>
              <span className="text-primary-600">/ 100</span>
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sub-scores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUB_SCORES.map(({ key, label, icon }) => {
              const value = s[key] as number;
              const isMaintenance = key === 'maintenanceComplexity';
              const displayValue = isMaintenance ? value : value;
              return (
                <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span className="text-primary-700">{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{displayValue}/100</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why this score?</h2>
          <ul className="space-y-2">
            {tractor.whyThisScore.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-primary-600 flex-shrink-0">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <section className="bg-green-50/60 rounded-xl border border-green-200 p-6">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <ThumbsUp className="h-5 w-5 text-green-700" /> Pros
            </h2>
            <ul className="space-y-2">
              {tractor.pros.map((p, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-green-600">✓</span> {p}
                </li>
              ))}
            </ul>
          </section>
          <section className="bg-amber-50/60 rounded-xl border border-amber-200 p-6">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <ThumbsDown className="h-5 w-5 text-amber-700" /> Cons
            </h2>
            <ul className="space-y-2">
              {tractor.cons.map((c, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-amber-600">•</span> {c}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-primary-50/50 rounded-xl border border-primary-200 p-6 mb-8">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
            <FileText className="h-5 w-5 text-primary-700" /> Expert summary
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tractor.expertSummary}</p>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
            <HelpCircle className="h-5 w-5 text-primary-700" /> FAQ
          </h2>
          <dl className="space-y-4">
            {tractor.faq.map((item, i) => (
              <div key={i}>
                <dt className="font-semibold text-gray-900 mb-1">{item.q}</dt>
                <dd className="text-sm text-gray-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-8 text-sm text-gray-500">
          <Link href="/methodology" className="text-primary-600 hover:underline">TractorFit™ methodology</Link>
          {' · '}
          <Link href="/tractores" className="text-primary-600 hover:underline">Full tractor database</Link>
        </p>
      </main>
    </div>
  );
}
