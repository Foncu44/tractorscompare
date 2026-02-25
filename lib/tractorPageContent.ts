/**
 * Deterministic page content for tractor detail: insights, tab notes, FAQs.
 * No AI; stable seed (FNV-1a from slug) for phrase variation.
 */

import type { Tractor } from '@/types/tractor';

export type SimilarTractorItem = { slug: string; brand: string; model: string };

/**
 * Same category, HP within ±15%, prefer same brand, exclude current slug. Returns 3–6 items.
 */
export function getSimilarTractors(
  current: Tractor,
  allTractors: Tractor[],
  maxCount: number = 6
): SimilarTractorItem[] {
  const hp = current.engine?.powerHP ?? 0;
  const low = hp * 0.85;
  const high = hp * 1.15;
  const type = current.type;
  const brand = current.brand;

  const sameBrand: SimilarTractorItem[] = [];
  const other: SimilarTractorItem[] = [];

  for (const t of allTractors) {
    if (t.slug === current.slug) continue;
    if (t.type !== type) continue;
    const tHp = t.engine?.powerHP ?? 0;
    if (tHp < low || tHp > high) continue;

    const item = { slug: t.slug, brand: t.brand, model: t.model };
    if (t.brand.toLowerCase() === brand.toLowerCase()) {
      sameBrand.push(item);
    } else {
      other.push(item);
    }
  }

  const combined = [...sameBrand, ...other];
  return combined.slice(0, Math.max(3, Math.min(maxCount, combined.length)));
}

/** Best category slug by HP band for hub links */
export function getHpBandHubSlug(hp: number): string | null {
  if (hp < 50) return 'compact-tractors-under-50hp';
  if (hp < 100) return 'small-farm-tractors';
  return 'large-farm-tractors';
}

const SUBSCORE_LABELS: { key: keyof TractorSuitabilityResult; label: string }[] = [
  { key: 'loaderScore', label: 'loader work' },
  { key: 'smallFarmScore', label: 'small farms' },
  { key: 'largeFarmScore', label: 'large farms' },
  { key: 'fuelEfficiency', label: 'fuel efficiency' },
  { key: 'versatilityIndex', label: 'versatility' },
];

/** One-line "best for" from top subscores (for subheading). */
export function getBestForSubheading(
  suitabilityResult: TractorSuitabilityResult,
  limit: number = 2
): string[] {
  const entries = SUBSCORE_LABELS.map(({ key, label }) => ({
    label,
    value: suitabilityResult[key] as number,
  })).filter((e) => e.value != null && e.value >= 0);
  entries.sort((a, b) => b.value - a.value);
  return entries.slice(0, limit).map((e) => e.label);
}
import type { TractorNarrative } from '@/lib/tractorNarrative';
import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';
import type { TractorNarrative } from '@/lib/tractorNarrative';
import type { UsedPriceEstimate } from '@/lib/usedPriceEstimate';

export type TractorInsights = {
  highlights: string[];
  tradeoffs: string[];
  bestFor: string[];
  notIdealFor: string[];
  fitInterpretation: string;
};

export type TabMeaningNote = {
  tabId: string;
  note: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

type TabId = 'engine' | 'transmission' | 'hydraulics' | 'pto' | 'dimensions' | 'capacities' | 'tires';

function fnv1a(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  if (!arr.length) return null as unknown as T;
  const idx = (seed + offset) % arr.length;
  return arr[Math.abs(idx)];
}

function powerBand(hp: number): string {
  if (hp < 25) return 'under25';
  if (hp <= 60) return '25_60';
  if (hp <= 120) return '60_120';
  if (hp <= 180) return '120_180';
  return '180plus';
}

function categoryLabel(t: Tractor): 'Farm' | 'Lawn' | 'Industrial' {
  if (t.type === 'lawn') return 'Lawn';
  if (t.type === 'industrial') return 'Industrial';
  return 'Farm';
}

/**
 * Build insights from precomputed narrative (highlights, tradeoffs, best/not ideal, interpretation).
 */
export function buildTractorInsights(narrative: TractorNarrative): TractorInsights {
  return {
    highlights: narrative.highlights,
    tradeoffs: narrative.tradeoffs,
    bestFor: narrative.bestFor,
    notIdealFor: narrative.notIdealFor,
    fitInterpretation: narrative.summary,
  };
}

const ENGINE_NOTES: Record<string, string[]> = {
  Farm: [
    'Engine specs define power for PTO work, drawbar load, and fuel use. Higher displacement often means more torque at lower rpm.',
    'Gross HP and torque influence implement sizing; diesel is standard for farm use and longevity.',
    'Cylinder count and displacement affect smoothness and repair complexity; compare to similar models in the same HP band.',
  ],
  Lawn: [
    'Engine size drives mowing capacity and run time; gasoline is common for smaller lawn tractors.',
    'HP and cooling type affect durability under continuous load; liquid cooling is preferred for heavy mowing.',
    'Smaller engines favor residential use; check oil capacity and service intervals for your usage.',
  ],
  Industrial: [
    'Industrial use demands reliability under load; engine specs affect duty cycle and attachment compatibility.',
    'Power and cooling capacity matter for loader and backhoe work; diesel is typical for industrial tractors.',
  ],
};

const TRANS_NOTES: Record<string, string[]> = {
  manual: [
    'Manual transmission keeps cost down and is well understood; gear count affects field speed options.',
    'Clutch and gear layout influence durability and operator fatigue over long days.',
  ],
  hydrostatic: [
    'Hydrostatic drive gives smooth, variable speed control ideal for loaders and yard work; no clutch.',
    'HST is convenient for tasks requiring frequent direction changes and fine speed control.',
  ],
  powershift: [
    'Powershift allows on-the-go ratio changes; reduces clutch wear and supports productive fieldwork.',
    'Partial or full powershift improves efficiency when conditions and load vary.',
  ],
  cvt: [
    'CVT keeps the engine in an efficient range across speeds; well suited to variable fieldwork.',
    'Continuously variable transmission maximizes fuel use and operator comfort in mixed tasks.',
  ],
};

const HYDRAULICS_NOTES = [
  'Pump flow and lift capacity determine implement speed and size; more valves mean more flexibility.',
  'Hydraulic specs affect loader and three-point performance; verify category (I/II/III) for your implements.',
];

const PTO_NOTES = [
  'PTO HP and speed (540/1000 rpm) must match your mowers, tillers, and hay equipment; verify before buying.',
  'Rear PTO is standard; front PTO is optional on some models and useful for mid-mount mowers.',
];

const DIMENSIONS_NOTES = [
  'Wheelbase and clearance affect stability and crop clearance; track width may be adjustable.',
  'Dimensions matter for transport, shed storage, and implement compatibility.',
];

const TIRES_NOTES = [
  'Tire size and type affect traction and flotation; optional sizes may be listed for different applications.',
  'Match tire size to your soil and implement requirements; ballast can improve traction.',
];

const CAPACITIES_NOTES = [
  'Fuel and fluid capacities influence run time and service intervals; larger tanks reduce refills in the field.',
  'Check oil and coolant capacities for your operating conditions and climate.',
];

/**
 * Build short "What this means" note per specs tab. Deterministic from category, HP, transmission, PTO.
 */
export function buildTabMeaningNotes(tractor: Tractor): Record<TabId, string> {
  const seed = fnv1a(tractor.slug);
  const cat = categoryLabel(tractor);
  const hp = tractor.engine?.powerHP ?? 0;
  const band = powerBand(hp);
  const txType = (tractor.transmission?.type ?? 'manual').toLowerCase() as keyof typeof TRANS_NOTES;
  const txKey = TRANS_NOTES[txType] ? txType : 'manual';

  const engineNote = pick(ENGINE_NOTES[cat] ?? ENGINE_NOTES.Farm, seed, 0);
  const transNote = pick(TRANS_NOTES[txKey] ?? TRANS_NOTES.manual, seed, 1);
  const hydrNote = pick(HYDRAULICS_NOTES, seed, 2);
  const ptoNote = tractor.ptoHP != null && tractor.ptoHP > 0
    ? pick(PTO_NOTES, seed, 3)
    : 'PTO data not listed; confirm rear (and front if needed) PTO speed and power for your implements.';
  const dimNote = pick(DIMENSIONS_NOTES, seed, 4);
  const tireNote = pick(TIRES_NOTES, seed, 5);
  const capNote = pick(CAPACITIES_NOTES, seed, 6);

  return {
    engine: engineNote,
    transmission: transNote,
    hydraulics: hydrNote,
    pto: ptoNote,
    dimensions: dimNote,
    tires: tireNote,
    capacities: capNote,
  };
}

const FAQ_QUESTION_TEMPLATES: Array<(name: string, t: Tractor, seed: number) => { q: string; a: string }> = [
  (name, t, seed) => ({
    q: `What is the horsepower of the ${name}?`,
    a: t.engine?.powerHP
      ? `The ${name} is rated at ${t.engine.powerHP} HP (gross)${t.engine.powerKW ? ` (${t.engine.powerKW} kW)` : ''}.`
      : `Engine power is not listed in our data; check the manufacturer or dealer for current specs.`,
  }),
  (name, t, seed) => ({
    q: `What type of transmission does the ${name} have?`,
    a: t.transmission?.type
      ? `The ${name} uses a ${t.transmission.type} transmission${t.transmission.gears ? ` (${t.transmission.gears}-speed)` : ''}.`
      : `Transmission type is not specified in our data.`,
  }),
  (name, t, seed) => ({
    q: `What is the weight of the ${name}?`,
    a: t.weight
      ? `Operating weight is approximately ${t.weight.toLocaleString()} kg (${Math.round(t.weight / 1000)} tons).`
      : `Published weight is not available; confirm with the seller or manufacturer for transport and ballasting.`,
  }),
  (name, t, seed) => ({
    q: `Does the ${name} have a PTO?`,
    a: t.ptoHP != null && t.ptoHP > 0
      ? `Yes. The ${name} has a rear PTO rated at ${t.ptoHP} HP${t.ptoRPM ? ` at ${t.ptoRPM} rpm` : ''}.`
      : `PTO specs are not listed; verify rear and front PTO availability and speed before matching implements.`,
  }),
  (name, t, seed) => ({
    q: `What is the ${name} best used for?`,
    a: t.type === 'farm'
      ? `As a farm tractor, the ${name} is suited to fieldwork, PTO-driven implements, hay work, and general estate or small-farm tasks.`
      : t.type === 'lawn'
        ? `As a lawn tractor, the ${name} is best for mowing, light loader work, and property maintenance.`
        : `The ${name} is aimed at industrial or utility use such as loaders and site work.`,
  }),
  (name, t, seed) => ({
    q: `What fuel does the ${name} use?`,
    a: t.engine?.fuelType
      ? `The ${name} uses ${t.engine.fuelType} fuel.`
      : `Fuel type is not specified in our data.`,
  }),
  (name, t, seed) => ({
    q: `How much does a used ${name} cost?`,
    a: `Used prices vary by hours, condition, region, and attachments. Check our estimated used price on this page and compare with current listings.`,
  }),
  (name, t, seed) => ({
    q: `Is the ${name} good for loader work?`,
    a: `Loader suitability depends on front axle capacity, hydraulic flow, and attachment compatibility; see the TractorFit analysis on this page for a data-driven score.`,
  }),
  (name, t, seed) => ({
    q: `What should I check when buying a used ${name}?`,
    a: `Verify hours, condition, service history, PTO operation, hydraulics, and tire wear. Confirm weight and dimensions if you need to transport or match implements.`,
  }),
  (name, t, seed) => ({
    q: `Where can I find used ${name} listings?`,
    a: `This page links to international marketplaces where you can search for used ${name} tractors; listings are provided by third parties.`,
  }),
];

/**
 * Build 6–10 FAQs deterministically. Uses tractor data, optional suitability and used estimate for richer answers.
 */
export function buildFaqs(
  tractor: Tractor,
  suitabilityResult?: TractorSuitabilityResult | null,
  usedEstimate?: UsedPriceEstimate | null,
  _narrative?: TractorNarrative | null
): FaqItem[] {
  const name = `${tractor.brand} ${tractor.model}`;
  const seed = fnv1a(tractor.slug);
  const count = 6 + (seed % 5);
  const indices: number[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count && indices.length < FAQ_QUESTION_TEMPLATES.length; i++) {
    const idx = (seed + i * 7) % FAQ_QUESTION_TEMPLATES.length;
    if (used.has(idx)) continue;
    used.add(idx);
    indices.push(idx);
  }
  const faqs: FaqItem[] = [];
  for (let i = 0; i < indices.length; i++) {
    const idx = indices[i];
    const fn = FAQ_QUESTION_TEMPLATES[idx];
    if (!fn) continue;
    const { q, a } = fn(name, tractor, seed + idx);
    let answer = a;
    if (idx === 6 && usedEstimate) {
      answer = `Used ${name} tractors are often listed in the range of $${usedEstimate.usedMin.toLocaleString()}–$${usedEstimate.usedMax.toLocaleString()} USD (${usedEstimate.confidence} confidence). Actual prices depend on hours, condition, and region.`;
    }
    if (idx === 7 && suitabilityResult != null) {
      const loaderScore = suitabilityResult.loaderScore;
      const desc = loaderScore >= 70 ? 'well suited' : loaderScore >= 50 ? 'moderately suited' : 'less suited';
      answer = `TractorFit scores rate this model as ${desc} for loader work (${loaderScore}/100). Check front axle capacity and loader compatibility for your intended use.`;
    }
    faqs.push({ question: q, answer });
  }
  return faqs;
}

/*
 * Example outputs (deterministic; same tractor → same output):
 *
 * Fendt 822 Vario (high HP, ~220 HP, farm, CVT):
 *   buildTractorInsights(narrative) → fitInterpretation ~90–130 words; highlights 5–8 (power band 180+,
 *     CVT, weight if present, PTO, suitability); tradeoffs 2–3 (e.g. maintenance/loader if low);
 *     bestFor 3–5 (large farms, heavy tillage, high-capacity PTO); notIdealFor 2–4.
 *   buildFaqs(tractor, suitability, usedEstimate) → 6–10 FAQs e.g. "What is the horsepower of the Fendt 822 Vario?",
 *     "What type of transmission...", "How much does a used Fendt 822 Vario cost?" (with used range if estimate present),
 *     "Is the Fendt 822 Vario good for loader work?" (with loader score).
 *
 * John Deere 850 (mid HP, ~24 HP, farm/utility, manual):
 *   buildTractorInsights(narrative) → fitInterpretation for 25_60 or under25 band; highlights include
 *     compact/mid-range power, manual transmission, PTO/weight if present; bestFor small farms, mowing, light loader;
 *     notIdealFor heavy tillage or large acreage.
 *   buildFaqs(...) → FAQs with JD 850-specific answers; used price range if estimated; loader suitability from score.
 */
