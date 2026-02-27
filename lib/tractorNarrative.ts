/**
 * Deterministic, rule-based tractor narrative generation.
 * Same tractor + same data → same output. No AI, no external APIs.
 * Uses phrase banks + FNV-1a seed for variation across tractors.
 */

export type TractorNarrative = {
  summary: string;
  highlights: string[];
  tradeoffs: string[];
  bestFor: string[];
  notIdealFor: string[];
  buyingTips: string[];
};

export type TractorNarrativeInput = {
  fullName: string;
  brandName: string;
  modelName: string;
  category?: string;
  hp?: number | null;
  ptoHP?: number | null;
  ptoRPM?: number | null;
  weightKg?: number | null;
  fuelType?: string | null;
  cooling?: string | null;
  transmissionType?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  usedMin?: number | null;
  usedMax?: number | null;
  suitability?: {
    overallScore?: number;
    loaderWork?: number;
    fuelEfficiency?: number;
    maintenance?: number;
    versatility?: number;
    costTier?: number;
  };
};

// --- FNV-1a 32-bit hash for deterministic seeding ---
function fnv1a(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seedFrom(input: TractorNarrativeInput): number {
  return fnv1a(input.fullName + '|' + (input.hp ?? 0) + '|' + (input.weightKg ?? 0));
}

/** Pick one option from array using seed; successive calls use seed + 1, seed + 2, ... */
function pick<T>(arr: T[], seed: number, offset: number = 0): T {
  if (!arr.length) return null as unknown as T;
  const idx = (seed + offset) % arr.length;
  return arr[Math.abs(idx)];
}

// --- Bands ---
function powerBand(hp: number): 'under25' | '25_60' | '60_120' | '120_180' | '180plus' {
  if (hp < 25) return 'under25';
  if (hp <= 60) return '25_60';
  if (hp <= 120) return '60_120';
  if (hp <= 180) return '120_180';
  return '180plus';
}

function weightBand(kg: number): 'light' | 'mid' | 'heavy' {
  if (kg < 2000) return 'light';
  if (kg <= 6000) return 'mid';
  return 'heavy';
}

function scoreBand(s: number): 'high' | 'medium' | 'low' {
  if (s >= 75) return 'high';
  if (s >= 55) return 'medium';
  return 'low';
}

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: 'manual',
  hydrostatic: 'hydrostatic',
  powershift: 'powershift',
  cvt: 'CVT',
};

// --- Phrase banks (intro / power / transmission / category) ---
const INTRO_LEADS = [
  'This model sits in the ',
  'With its specs, the ',
  'Positioned in the ',
  'A ',
];

const POWER_PHRASES: Record<string, string[]> = {
  under25: [
    'compact utility class with engine power suited to property maintenance and light duties.',
    'low-horsepower segment ideal for mowing, landscaping, and small-acreage tasks.',
    'sub-25 HP band aimed at residential and small commercial use.',
  ],
  '25_60': [
    'mid-range utility segment capable of loader work, mowing, and medium-acreage farming.',
    '25–60 HP band suited to mixed use: hay work, grading, and general estate tasks.',
    'utility class that balances capability and operating cost for small to mid-size operations.',
  ],
  '60_120': [
    'high-utility band suited to row-crop, hay, and heavier loader and tillage work.',
    '60–120 HP range that fits full-time farming and large-property management.',
    'mainstream farm segment for fieldwork, feeding, and material handling.',
  ],
  '120_180': [
    'high-horsepower segment for demanding fieldwork and large-scale operations.',
    '120–180 HP band suited to heavy tillage, large hay operations, and high-capacity work.',
    'high-power class for producers who need strong PTO and hydraulic performance.',
  ],
  '180plus': [
    'high-horsepower tier for heavy tillage, big balers, and large-acreage efficiency.',
    '180+ HP segment aimed at maximum productivity and large-implement compatibility.',
    'top power band for large farms and contractors who need maximum drawbar and PTO output.',
  ],
};

const TRANSMISSION_PHRASES: Record<string, string[]> = {
  manual: [
    'Manual transmission keeps ownership costs down and is well understood for maintenance.',
    'A manual gearbox offers straightforward operation and lower complexity.',
    'Manual transmission is a proven choice for operators who prefer direct gear selection.',
  ],
  hydrostatic: [
    'Hydrostatic transmission provides smooth, variable control ideal for loader and yard work.',
    'Hydrostatic drive allows infinite speed control and easy direction changes.',
    'HST offers ease of use for tasks that require frequent speed and direction changes.',
  ],
  powershift: [
    'Powershift or partial powershift improves productivity in fieldwork with on-the-go shifts.',
    'Powershift transmission reduces clutch wear and supports efficient field operation.',
    'Powershift capability helps maintain momentum during load and terrain changes.',
  ],
  cvt: [
    'CVT or continuously variable transmission maximizes efficiency across a wide speed range.',
    'CVT allows the engine to operate in an optimal range for fuel and performance.',
    'Continuously variable transmission suits operators who want seamless speed adjustment.',
  ],
  unknown: [
    'Transmission type influences operating style and best use cases.',
    'Transmission choice affects durability, efficiency, and ease of operation.',
  ],
};

const CATEGORY_PHRASES: Record<string, string[]> = {
  Farm: [
    'As a farm tractor, it is built for fieldwork, PTO-driven implements, and all-day reliability.',
    'Farm-oriented design prioritizes drawbar and PTO work, hydraulics, and durability.',
    'Agricultural use cases include tillage, planting, hay, and material handling.',
  ],
  Lawn: [
    'As a lawn and garden tractor, it targets mowing, light loader work, and property upkeep.',
    'Lawn and garden use focuses on maneuverability, attachment compatibility, and operator comfort.',
    'Best suited to residential and light commercial mowing and landscaping.',
  ],
  Industrial: [
    'Industrial and utility use typically involves loaders, backhoes, and site work.',
    'Industrial tractors are often used for construction, landscaping, and material handling.',
  ],
};

const PTO_PHRASES = [
  'PTO horsepower and speed options support mowers, hay tools, and other driven implements.',
  'Rear PTO capability allows use of mowers, tillers, and other PTO-driven equipment.',
  'PTO specs determine compatibility with mowers, balers, and other powered attachments.',
];

const NO_PTO_TRADEOFF = 'PTO specs are not listed; verify rear (and front if needed) PTO speed and power before matching implements.';

const WEIGHT_TRADEOFF = 'Published weight is missing; confirm actual weight for transport, stability, and tire ballasting decisions.';

const MAINTENANCE_TRADEOFFS = [
  'Maintenance complexity is rated on the higher side; factor in service access and parts availability.',
  'Suitability scoring suggests above-average maintenance demands; consider repair history and local support.',
];

const LOADER_TRADEOFFS = [
  'Loader suitability scores modestly; check front axle capacity and loader compatibility for heavy material work.',
  'Loader and front attachment suitability is limited by design; best for lighter loader duties.',
];

function buildSummary(input: TractorNarrativeInput, seed: number): string {
  const hp = input.hp ?? 0;
  const band = hp > 0 ? powerBand(hp) : '25_60';
  const cat = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : input.category === 'industrial' || input.category === 'Industrial' ? 'Industrial' : 'Farm';
  const txType = (input.transmissionType || 'manual').toLowerCase();
  const txKey = TRANSMISSION_LABELS[txType] ? txType : 'unknown';

  const powerPhrases = POWER_PHRASES[band] || POWER_PHRASES['25_60'];
  const powerClause = pick(powerPhrases, seed, 1);
  const txPhrases = TRANSMISSION_PHRASES[txKey] || TRANSMISSION_PHRASES.unknown;
  const txClause = pick(txPhrases, seed, 2);
  const catPhrases = CATEGORY_PHRASES[cat] || CATEGORY_PHRASES.Farm;
  const catClause = pick(catPhrases, seed, 3);

  const lead = pick(INTRO_LEADS, seed, 0);
  const firstSentence = lead.endsWith(' ') ? lead + powerClause : lead + powerClause;
  const parts: string[] = [firstSentence, txClause, catClause];

  if (input.ptoHP != null && input.ptoHP > 0) {
    parts.push(pick(PTO_PHRASES, seed, 4));
  }

  const numericFacts: string[] = [];
  if (hp > 0) numericFacts.push(`${hp} HP`);
  if (input.ptoHP != null && input.ptoHP > 0) numericFacts.push(`${input.ptoHP} HP PTO`);
  if (input.weightKg != null && input.weightKg > 0) numericFacts.push(`${Math.round(input.weightKg / 1000)} t operating weight`);
  if (input.usedMin != null && input.usedMax != null) numericFacts.push(`estimated used range $${input.usedMin.toLocaleString()}–$${input.usedMax.toLocaleString()}`);
  const overall = input.suitability?.overallScore;
  if (overall != null && overall >= 0) numericFacts.push(`overall suitability ${Math.round(overall)}/100`);

  if (numericFacts.length > 0) {
    const factClause = numericFacts.length <= 2
      ? numericFacts.join(' and ')
      : numericFacts.slice(0, -1).join(', ') + ', and ' + numericFacts[numericFacts.length - 1];
    parts.push(`Key specs include ${factClause}.`);
  }

  return parts.join(' ');
}

function buildHighlights(input: TractorNarrativeInput, seed: number): string[] {
  const out: string[] = [];
  const hp = input.hp ?? 0;
  const band = hp > 0 ? powerBand(hp) : '25_60';
  const cat = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : input.category === 'industrial' || input.category === 'Industrial' ? 'Industrial' : 'Farm';

  if (hp > 0) {
    const hpBullets: Record<string, string[]> = {
      under25: ['Compact engine output suits mowing and light loader use.', 'Low horsepower keeps fuel use and noise down.'],
      '25_60': ['Mid-range power fits mixed loader, mowing, and light tillage.', 'Engine size balances capability with operating cost.'],
      '60_120': ['Strong engine power for PTO work and heavy drawbar loads.', 'HP band suits full-season fieldwork and feeding.'],
      '120_180': ['High horsepower supports large implements and high capacity.', 'Engine output suits heavy tillage and large hay equipment.'],
      '180plus': ['Top-tier power for maximum productivity and large implements.', 'High HP supports big balers, heavy tillage, and large acreage.'],
    };
    out.push(pick(hpBullets[band] || hpBullets['25_60'], seed, 10));
  }

  if (input.transmissionType) {
    const tx = input.transmissionType.toLowerCase();
    if (tx === 'cvt') out.push('CVT transmission allows seamless speed adjustment and can improve fuel use.');
    else if (tx === 'hydrostatic') out.push('Hydrostatic transmission gives smooth control for loader and yard work.');
    else if (tx === 'powershift') out.push('Powershift or partial powershift supports efficient fieldwork.');
    else out.push('Manual transmission keeps design simple and ownership costs lower.');
  }

  if (input.weightKg != null && input.weightKg > 0) {
    const tons = Math.round(input.weightKg / 1000);
    const wBand = weightBand(input.weightKg);
    if (wBand === 'light') out.push(`Operating weight around ${tons} t aids maneuverability and transport.`);
    else if (wBand === 'heavy') out.push(`Operating weight around ${tons} t supports traction and ballast for heavy implements.`);
    else out.push(`${tons} t operating weight fits a broad range of implements and conditions.`);
  }

  if (input.ptoHP != null && input.ptoHP > 0) {
    out.push(`Rated PTO output of ${input.ptoHP} HP supports mowers, hay tools, and other driven implements.`);
  }

  const suit = input.suitability;
  if (suit?.overallScore != null) {
    const band = scoreBand(suit.overallScore);
    if (band === 'high') out.push(`Overall suitability scores in the top band for its class.`);
    else if (band === 'medium') out.push(`Suitability profile is solid across typical use cases.`);
  }
  if (suit?.fuelEfficiency != null && suit.fuelEfficiency >= 70) {
    out.push('Fuel efficiency scores well for its power class.');
  }
  if (suit?.versatility != null && suit.versatility >= 70) {
    out.push('Versatility index supports a wide range of tasks and attachments.');
  }

  if (input.usedMin != null && input.usedMax != null) {
    out.push(`Estimated used price range: $${input.usedMin.toLocaleString()}–$${input.usedMax.toLocaleString()} USD.`);
  }

  if (cat === 'Lawn') out.push('Lawn and garden focus favors mowing and property maintenance.');
  else if (cat === 'Farm') out.push('Farm orientation targets fieldwork, PTO work, and reliability.');

  // Dedupe and trim to 5–8
  const seen = new Set<string>();
  const filtered = out.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });
  return filtered.slice(0, 8);
}

function buildTradeoffs(input: TractorNarrativeInput): string[] {
  const out: string[] = [];
  if (input.ptoHP == null && input.ptoRPM == null) out.push(NO_PTO_TRADEOFF);
  if (input.weightKg == null || input.weightKg <= 0) out.push(WEIGHT_TRADEOFF);
  const maint = input.suitability?.maintenance;
  if (maint != null && maint < 55) out.push(pick(MAINTENANCE_TRADEOFFS, fnv1a(input.fullName), 0));
  const loader = input.suitability?.loaderWork;
  if (loader != null && loader < 55) out.push(pick(LOADER_TRADEOFFS, fnv1a(input.fullName), 1));
  return out.slice(0, 3);
}

function buildBestFor(input: TractorNarrativeInput, seed: number): string[] {
  const out: string[] = [];
  const hp = input.hp ?? 0;
  const band = hp > 0 ? powerBand(hp) : '25_60';
  const cat = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : input.category === 'industrial' || input.category === 'Industrial' ? 'Industrial' : 'Farm';
  const suit = input.suitability;

  const farmByBand: Record<string, string[]> = {
    under25: ['Small property maintenance', 'Landscaping and mowing', 'Light material handling'],
    '25_60': ['Small to mid-size hay work', 'Loader and grading', 'Mixed farming and estate use'],
    '60_120': ['Row-crop and hay operations', 'Feeding and material handling', 'Full-season fieldwork'],
    '120_180': ['Heavy tillage and large hay', 'High-capacity harvesting', 'Large-acreage farming'],
    '180plus': ['Maximum productivity fieldwork', 'Large balers and tillage', 'Big-acreage and contractor use'],
  };

  const lawnByBand: Record<string, string[]> = {
    under25: ['Residential mowing', 'Small property upkeep', 'Light towing'],
    '25_60': ['Commercial mowing', 'Estate and park maintenance', 'Light loader work'],
    '60_120': ['Large property mowing', 'Landscaping and grading', 'Multi-use property management'],
    '120_180': ['Large commercial grounds', 'Heavy landscaping', 'Contractor and municipal use'],
    '180plus': [],
  };

  const base = cat === 'Lawn' ? (lawnByBand[band] || lawnByBand['25_60']) : (farmByBand[band] || farmByBand['25_60']);
  out.push(...base);

  if (suit?.loaderWork != null && suit.loaderWork >= 65) out.push('Loader and material handling');
  if (suit?.fuelEfficiency != null && suit.fuelEfficiency >= 70) out.push('Fuel-conscious operation');
  if (suit?.versatility != null && suit.versatility >= 70) out.push('Mixed tasks and attachment use');

  const seen = new Set<string>();
  return out.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 5);
}

function buildNotIdealFor(input: TractorNarrativeInput, seed: number): string[] {
  const out: string[] = [];
  const hp = input.hp ?? 0;
  const band = hp > 0 ? powerBand(hp) : '25_60';
  const suit = input.suitability;

  if (suit?.loaderWork != null && suit.loaderWork < 50) out.push('Heavy, continuous loader work');
  if (suit?.maintenance != null && suit.maintenance < 50) out.push('Low-maintenance-first buyers');
  if (band === 'under25' || band === '25_60') out.push('Large-acreage row-crop or heavy tillage');
  if (band === '180plus') out.push('Light-duty or compact-property-only use');

  const seen = new Set<string>();
  return out.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 4);
}

function buildBuyingTips(input: TractorNarrativeInput, seed: number): string[] {
  const tips: string[] = [];
  const cat = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : 'Farm';
  const hasPTO = input.ptoHP != null || input.ptoRPM != null;

  if (cat === 'Farm') {
    tips.push('Check engine and PTO hours; service history matters for long-term reliability.');
    if (hasPTO) tips.push('Confirm PTO speed (540/1000) and HP match your mowers, balers, or other implements.');
    tips.push('Inspect hydraulics and three-point hitch condition; repair costs can be high.');
  } else {
    tips.push('Verify mower deck or attachment compatibility and condition.');
    tips.push('Check for oil leaks and transmission operation; HST repairs are costly.');
    tips.push('Confirm tire condition and that the machine fits your storage and access.');
  }

  return tips.slice(0, 3);
}

export function buildTractorNarrative(input: TractorNarrativeInput): TractorNarrative {
  const seed = seedFrom(input);

  const summary = buildSummary(input, seed);
  const highlights = buildHighlights(input, seed);
  const tradeoffs = buildTradeoffs(input);
  const bestFor = buildBestFor(input, seed);
  const notIdealFor = buildNotIdealFor(input, seed);
  const buyingTips = buildBuyingTips(input, seed);

  return {
    summary,
    highlights,
    tradeoffs,
    bestFor,
    notIdealFor,
    buyingTips,
  };
}
