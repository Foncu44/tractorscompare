/**
 * Best Tractors categories for /best/[category]. EN only.
 * Placeholders in templates: {{count}}, {{medianHP}}, {{medianWeightKg}}, {{medianPtoHP}},
 * {{medianPowerToWeight}}, {{ptoCoveragePct}}, {{minHp}}, {{maxHp}}.
 */

export interface FilterRules {
  minHp?: number;
  maxHp?: number;
  minWeight?: number;
  maxWeight?: number;
  minLoaderScore?: number;
  minSmallFarmScore?: number;
  minLargeFarmScore?: number;
  minFuelEfficiency?: number;
  maxMaintenanceComplexity?: number;
  minVersatility?: number;
  minPowerToWeight?: number;
  transmissionTypes?: string[];
  types?: string[];
}

export type TractorFitScoreKey =
  | 'overallScore'
  | 'smallFarmScore'
  | 'largeFarmScore'
  | 'loaderScore'
  | 'fuelEfficiencyIndex'
  | 'maintenanceComplexity'
  | 'versatilityIndex'
  | 'powerToWeightScore';

export interface RankingMethod {
  weights: Partial<Record<TractorFitScoreKey, number>>;
}

export interface FaqTemplate {
  q: string;
  a: string;
}

export interface BestCategoryDef {
  slug: string;
  title: string;
  introTemplate: string;
  methodologyBullets: string[];
  faqTemplates: FaqTemplate[];
  /** Used by buildBestIndexes only */
  filterRules: FilterRules;
  rankingMethod: RankingMethod;
}

/** Item in data/indexes/best-{slug}.json */
export interface BestIndexItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  hp: number | null;
  ptoHP: number | null;
  weightKg: number | null;
  overallScore: number;
  categoryScore: number;
  reasons: [string, string, string];
}

export interface BestIndexStats {
  count: number;
  medianHP: number | null;
  medianWeightKg: number | null;
  medianPtoHP: number | null;
  medianPowerToWeight: number | null;
  ptoCoveragePct: number;
}

export interface BestIndexFile {
  category: { slug: string; title: string };
  updatedAt: string;
  stats: BestIndexStats;
  items: BestIndexItem[];
}

const SLUGS = [
  'loader-work',
  'small-farms',
  'mid-size-farms',
  'large-farms',
  'utility-tractors',
  'orchard-vineyard',
  'hay-farming',
  'property-maintenance',
  'lightweight-easy-transport',
  'under-25-hp',
  '25-40-hp',
  '40-60-hp',
  '60-90-hp',
  '90-120-hp',
  '120-180-hp',
  'over-180-hp',
  'manual-transmission',
  'cvt-transmission',
  'hydrostatic-transmission',
  'best-value',
] as const;

const CATEGORIES: BestCategoryDef[] = [
  {
    slug: 'loader-work',
    title: 'Best Tractors for Loader Work',
    introTemplate: 'These {{count}} tractors rank highest for loader work by TractorFit™: hydraulic flow, lift capacity, and operating weight. In this selection median engine power is {{medianHP}} HP and median PTO power {{medianPtoHP}} HP. Suitable for material handling, hay, and utility.',
    methodologyBullets: [
      'Eligible tractors must meet a minimum TractorFit™ loader score (hydraulic flow and lift capacity).',
      'Ranking uses a weighted combination of loader score (60%), overall score (25%), and versatility (15%).',
      'The top 20 are selected deterministically; no randomness. Reasons are derived from each tractor’s TractorFit™ analysis.',
    ],
    faqTemplates: [
      { q: 'How are loader tractors ranked?', a: 'We rank by TractorFit™ loader score (hydraulic flow, rear and front lift, weight) plus overall balance and versatility. Only tractors above the loader threshold are eligible.' },
      { q: 'What specs matter for loader work?', a: 'In this list, median engine power is {{medianHP}} HP and median PTO power is {{medianPtoHP}} HP. PTO coverage in the selection is {{ptoCoveragePct}}%.' },
    ],
    filterRules: { minLoaderScore: 50 },
    rankingMethod: { weights: { loaderScore: 0.6, overallScore: 0.25, versatilityIndex: 0.15 } },
  },
  {
    slug: 'small-farms',
    title: 'Best Tractors for Small Farms',
    introTemplate: 'These {{count}} tractors score highest for small-farm suitability: power class, maneuverability, and running costs. Median power {{medianHP}} HP (range {{minHp}}–{{maxHp}} HP). Ideal for 5–40 acres.',
    methodologyBullets: [
      'Eligible tractors are limited by maximum HP and must meet a minimum small-farm score.',
      'Ranking combines small-farm score (55%), overall score (30%), and fuel-efficiency index (15%).',
      'Top 20 are chosen deterministically from the weighted score.',
    ],
    faqTemplates: [
      { q: 'What makes a tractor good for small farms?', a: 'TractorFit™ small-farm score favors moderate HP, maneuverability, and lower running costs. This list shows the top 20 by that score and overall balance.' },
      { q: 'What power range is typical?', a: 'In this selection median engine power is {{medianHP}} HP; the list spans {{minHp}}–{{maxHp}} HP.' },
    ],
    filterRules: { minSmallFarmScore: 50, maxHp: 100 },
    rankingMethod: { weights: { smallFarmScore: 0.55, overallScore: 0.3, fuelEfficiencyIndex: 0.15 } },
  },
  {
    slug: 'mid-size-farms',
    title: 'Best Tractors for Mid-Size Farms',
    introTemplate: 'Mid-size tractors (60–130 HP) for mixed fieldwork. These {{count}} rank highest for balance of power, versatility, and loader capability. Median {{medianHP}} HP, median PTO {{medianPtoHP}} HP.',
    methodologyBullets: [
      'Eligible tractors fall in the 60–130 HP band.',
      'Ranking uses overall score (45%), versatility (30%), and loader score (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'Who are mid-size tractors for?', a: 'Farms that need more power than compacts but not row-crop scale. This list is ranked by overall TractorFit™ and versatility.' },
    ],
    filterRules: { minHp: 60, maxHp: 130 },
    rankingMethod: { weights: { overallScore: 0.45, versatilityIndex: 0.3, loaderScore: 0.25 } },
  },
  {
    slug: 'large-farms',
    title: 'Best Tractors for Large Farms',
    introTemplate: 'These {{count}} tractors rank highest for large-acreage and intensive fieldwork. Median power {{medianHP}} HP and median PTO {{medianPtoHP}} HP. Suited to row-crop, heavy tillage, and high-capacity implements.',
    methodologyBullets: [
      'Eligible tractors have at least 80 HP and a minimum large-farm score.',
      'Ranking uses large-farm score (50%), overall score (35%), and loader score (15%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'How are large-farm tractors ranked?', a: 'Ranking uses TractorFit™ large-farm score (power, hydraulics, PTO) plus overall and loader scores. Only tractors meeting the HP and score thresholds are included.' },
    ],
    filterRules: { minHp: 80, minLargeFarmScore: 40 },
    rankingMethod: { weights: { largeFarmScore: 0.5, overallScore: 0.35, loaderScore: 0.15 } },
  },
  {
    slug: 'utility-tractors',
    title: 'Best Utility Tractors',
    introTemplate: 'These {{count}} tractors have the highest versatility scores: PTO options, hydraulic valves, and implement flexibility. Median {{medianHP}} HP. Best for mixed use.',
    methodologyBullets: [
      'Eligible tractors must meet a minimum versatility index.',
      'Ranking uses versatility (50%), overall score (35%), and loader score (15%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What does versatility mean here?', a: 'TractorFit™ versatility reflects PTO options, hydraulic valves, and suitability for multiple implements. This list ranks by that score plus overall balance.' },
    ],
    filterRules: { minVersatility: 50 },
    rankingMethod: { weights: { versatilityIndex: 0.5, overallScore: 0.35, loaderScore: 0.15 } },
  },
  {
    slug: 'orchard-vineyard',
    title: 'Best Tractors for Orchard & Vineyard',
    introTemplate: 'Tractors suited to narrow rows and low clearance: maneuverability and compact size. These {{count}} rank highest. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors are filtered by HP band and small-farm/versatility scores.',
      'Ranking emphasizes small-farm score and versatility.',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What matters for orchard and vineyard tractors?', a: 'Maneuverability, moderate power, and versatility for narrow-row work. This list is ranked by small-farm and versatility scores.' },
    ],
    filterRules: { maxHp: 90, minSmallFarmScore: 45, minVersatility: 45 },
    rankingMethod: { weights: { smallFarmScore: 0.4, versatilityIndex: 0.35, overallScore: 0.25 } },
  },
  {
    slug: 'hay-farming',
    title: 'Best Tractors for Hay Farming',
    introTemplate: 'Tractors ranked for hay and forage: PTO and versatility. These {{count}} lead. Median {{medianHP}} HP and {{medianPtoHP}} HP PTO. PTO coverage {{ptoCoveragePct}}%.',
    methodologyBullets: [
      'Eligible tractors have minimum versatility and HP.',
      'Ranking uses versatility (40%), overall (35%), and loader score (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'Why PTO and versatility for hay?', a: 'Hay work relies on PTO-driven implements and often multiple hydraulics. We rank by versatility, overall, and loader scores.' },
    ],
    filterRules: { minVersatility: 50, minHp: 40 },
    rankingMethod: { weights: { versatilityIndex: 0.4, overallScore: 0.35, loaderScore: 0.25 } },
  },
  {
    slug: 'property-maintenance',
    title: 'Best Tractors for Property Maintenance',
    introTemplate: 'Tractors for estates and property maintenance: small-farm fit and versatility. These {{count}} rank highest. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors are limited by max HP and must meet small-farm and versatility thresholds.',
      'Ranking uses small-farm score (50%), versatility (30%), and overall (20%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are property-maintenance tractors?', a: 'Tractors suited to mowing, light loader work, and varied implements on estates. This list is ranked by small-farm and versatility scores.' },
    ],
    filterRules: { maxHp: 75, minSmallFarmScore: 50, minVersatility: 45 },
    rankingMethod: { weights: { smallFarmScore: 0.5, versatilityIndex: 0.3, overallScore: 0.2 } },
  },
  {
    slug: 'lightweight-easy-transport',
    title: 'Best Lightweight & Easy-Transport Tractors',
    introTemplate: 'Tractors with lower weight for easier transport and maneuverability. These {{count}} rank highest when weight is capped. Median weight {{medianWeightKg}} kg, median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors are filtered by maximum weight and small-farm/overall scores.',
      'Ranking uses overall score (40%), small-farm (30%), and fuel efficiency (30%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What defines lightweight here?', a: 'We cap operating weight and rank by overall and small-farm fit. This list favors tractors that are easier to move and trailer.' },
    ],
    filterRules: { maxWeight: 2500, minSmallFarmScore: 45 },
    rankingMethod: { weights: { overallScore: 0.4, smallFarmScore: 0.3, fuelEfficiencyIndex: 0.3 } },
  },
  {
    slug: 'under-25-hp',
    title: 'Best Tractors Under 25 HP',
    introTemplate: 'Smallest power class: under 25 HP. These {{count}} rank highest for small-farm fit and overall balance. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power under 25 HP.',
      'Ranking uses small-farm score (55%), overall (30%), and fuel efficiency (15%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'Who are under-25-HP tractors for?', a: 'Small acreage, landscaping, and light duties. This list is ranked by small-farm suitability and overall score.' },
    ],
    filterRules: { maxHp: 24 },
    rankingMethod: { weights: { smallFarmScore: 0.55, overallScore: 0.3, fuelEfficiencyIndex: 0.15 } },
  },
  {
    slug: '25-40-hp',
    title: 'Best 25–40 HP Tractors',
    introTemplate: 'Tractors in the 25–40 HP band. These {{count}} rank highest for small-farm fit. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power between 25 and 40 HP.',
      'Ranking uses small-farm score (50%), overall (35%), and fuel efficiency (15%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are 25–40 HP tractors good for?', a: 'Small farms, estates, and mixed light work. This list is ranked by small-farm and overall TractorFit™ scores.' },
    ],
    filterRules: { minHp: 25, maxHp: 40 },
    rankingMethod: { weights: { smallFarmScore: 0.5, overallScore: 0.35, fuelEfficiencyIndex: 0.15 } },
  },
  {
    slug: '40-60-hp',
    title: 'Best 40–60 HP Tractors',
    introTemplate: 'Tractors in the 40–60 HP band. These {{count}} rank highest for balance of power and versatility. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power between 40 and 60 HP.',
      'Ranking uses overall score (45%), small-farm (30%), and versatility (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'Who are 40–60 HP tractors for?', a: 'Mid-small farms and mixed use. This list is ranked by overall TractorFit™ and small-farm fit.' },
    ],
    filterRules: { minHp: 40, maxHp: 60 },
    rankingMethod: { weights: { overallScore: 0.45, smallFarmScore: 0.3, versatilityIndex: 0.25 } },
  },
  {
    slug: '60-90-hp',
    title: 'Best 60–90 HP Tractors',
    introTemplate: 'Tractors in the 60–90 HP band. These {{count}} rank highest for mid-size work. Median {{medianHP}} HP, median PTO {{medianPtoHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power between 60 and 90 HP.',
      'Ranking uses overall score (50%), versatility (25%), and loader score (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are 60–90 HP tractors for?', a: 'Mid-size fieldwork and loader work. This list is ranked by overall and versatility scores.' },
    ],
    filterRules: { minHp: 60, maxHp: 90 },
    rankingMethod: { weights: { overallScore: 0.5, versatilityIndex: 0.25, loaderScore: 0.25 } },
  },
  {
    slug: '90-120-hp',
    title: 'Best 90–120 HP Tractors',
    introTemplate: 'Tractors in the 90–120 HP class. These {{count}} rank highest for overall TractorFit™. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power between 90 and 120 HP.',
      'Ranking uses overall score (50%), large-farm (25%), and loader score (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What is the 90–120 HP class?', a: 'The classic mid-high power band for mixed and large-acreage work. This list is ranked by overall and large-farm scores.' },
    ],
    filterRules: { minHp: 90, maxHp: 120 },
    rankingMethod: { weights: { overallScore: 0.5, largeFarmScore: 0.25, loaderScore: 0.25 } },
  },
  {
    slug: '120-180-hp',
    title: 'Best 120–180 HP Tractors',
    introTemplate: 'Tractors in the 120–180 HP range. These {{count}} rank highest for large-scale fieldwork. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power between 120 and 180 HP.',
      'Ranking uses large-farm score (50%), overall (35%), and power-to-weight (15%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are 120–180 HP tractors for?', a: 'Large acreage and heavy tillage. This list is ranked by large-farm and overall TractorFit™ scores.' },
    ],
    filterRules: { minHp: 120, maxHp: 180 },
    rankingMethod: { weights: { largeFarmScore: 0.5, overallScore: 0.35, powerToWeightScore: 0.15 } },
  },
  {
    slug: 'over-180-hp',
    title: 'Best Tractors Over 180 HP',
    introTemplate: 'High-horsepower tractors for large-scale work. These {{count}} rank highest. Median power {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have engine power over 180 HP.',
      'Ranking uses large-farm score (50%), overall (35%), and power-to-weight (15%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are 180+ HP tractors for?', a: 'Large acreage, heavy tillage, and high-capacity implements. This list is ranked by large-farm and overall scores.' },
    ],
    filterRules: { minHp: 181 },
    rankingMethod: { weights: { largeFarmScore: 0.5, overallScore: 0.35, powerToWeightScore: 0.15 } },
  },
  {
    slug: 'manual-transmission',
    title: 'Best Manual-Transmission Tractors',
    introTemplate: 'Tractors with manual transmission: lower complexity and cost. These {{count}} rank highest. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have manual transmission only.',
      'Ranking uses overall score (40%), small-farm (30%), and fuel efficiency (30%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'Why manual transmission?', a: 'Manual transmissions typically mean lower maintenance complexity and repair costs. This list includes only manual-transmission tractors.' },
    ],
    filterRules: { transmissionTypes: ['manual'] },
    rankingMethod: { weights: { overallScore: 0.4, smallFarmScore: 0.3, fuelEfficiencyIndex: 0.3 } },
  },
  {
    slug: 'cvt-transmission',
    title: 'Best CVT Transmission Tractors',
    introTemplate: 'Tractors with CVT transmission for smooth, efficient operation. These {{count}} rank highest. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have CVT transmission only.',
      'Ranking uses overall score (50%), versatility (25%), and loader score (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are CVT tractors?', a: 'CVT (continuously variable transmission) offers smooth speed control. This list includes only CVT models, ranked by overall TractorFit™.' },
    ],
    filterRules: { transmissionTypes: ['cvt'] },
    rankingMethod: { weights: { overallScore: 0.5, versatilityIndex: 0.25, loaderScore: 0.25 } },
  },
  {
    slug: 'hydrostatic-transmission',
    title: 'Best Hydrostatic Transmission Tractors',
    introTemplate: 'Tractors with hydrostatic transmission. These {{count}} rank highest in their segment. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors have hydrostatic transmission only.',
      'Ranking uses overall score (50%), versatility (25%), and loader score (25%).',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'What are hydrostatic tractors?', a: 'Hydrostatic transmission provides infinite speed variation and often easier operation. This list includes only hydrostatic models.' },
    ],
    filterRules: { transmissionTypes: ['hydrostatic'] },
    rankingMethod: { weights: { overallScore: 0.5, versatilityIndex: 0.25, loaderScore: 0.25 } },
  },
  {
    slug: 'best-value',
    title: 'Best Value Tractors',
    introTemplate: 'Tractors that balance overall TractorFit™ score with fuel efficiency and lower maintenance complexity. These {{count}} rank highest for value. Median {{medianHP}} HP.',
    methodologyBullets: [
      'Eligible tractors must meet a minimum overall score.',
      'Ranking uses overall score (50%), fuel efficiency (25%), and inverse maintenance complexity (25%) so simpler tractors rank higher.',
      'Top 20 are selected deterministically.',
    ],
    faqTemplates: [
      { q: 'How is value defined?', a: 'We combine overall TractorFit™ score with fuel-efficiency index and favor lower maintenance complexity (e.g. manual or simpler transmissions).' },
    ],
    filterRules: { minHp: 20 },
    rankingMethod: { weights: { overallScore: 0.5, fuelEfficiencyIndex: 0.25 } },
  },
];

// Normalize transmission for filter: some JSON may store "Manual" or "Hydrostatic"
const TRANSMISSION_ALIASES: Record<string, string[]> = {
  manual: ['manual'],
  hydrostatic: ['hydrostatic'],
  cvt: ['cvt'],
};

function normalizeTransmission(type: string): string {
  const t = (type ?? '').toLowerCase().trim();
  if (t.includes('cvt')) return 'cvt';
  if (t.includes('hydro')) return 'hydrostatic';
  if (t.includes('manual') || t === 'mechanical') return 'manual';
  return t || 'unknown';
}

export function getFilterRules(cat: BestCategoryDef): FilterRules {
  const r = { ...cat.filterRules };
  if (r.transmissionTypes?.length) {
    r.transmissionTypes = r.transmissionTypes.flatMap((t) =>
      TRANSMISSION_ALIASES[t] ?? [t]
    );
  }
  return r;
}

export const BEST_CATEGORIES = CATEGORIES;
export const BEST_CATEGORY_SLUGS = SLUGS as unknown as string[];

export function getBestCategoryBySlug(slug: string): BestCategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getBestCategorySlugs(): string[] {
  return [...BEST_CATEGORY_SLUGS];
}

export { normalizeTransmission };
