/**
 * Deterministic, rule-based tractor narrative generation.
 * Same tractor + same data → same output. No AI, no external APIs.
 * Uses phrase banks + FNV-1a seed for variation across tractors.
 * Supports locale 'en' | 'es' for bilingual output.
 */

export type NarrativeLocale = 'en' | 'es';

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

type BandKey = 'under25' | '25_60' | '60_120' | '120_180' | '180plus';
type CategoryKey = 'Farm' | 'Lawn' | 'Industrial';

const PHRASES: Record<NarrativeLocale, {
  INTRO_LEADS: string[];
  POWER_PHRASES: Record<string, string[]>;
  TRANSMISSION_PHRASES: Record<string, string[]>;
  CATEGORY_PHRASES: Record<string, string[]>;
  PTO_PHRASES: string[];
  NO_PTO_TRADEOFF: string;
  WEIGHT_TRADEOFF: string;
  MAINTENANCE_TRADEOFFS: string[];
  LOADER_TRADEOFFS: string[];
  KEY_SPECS_INCLUDE: string;
  AND: string;
  HP_PTO: string;
  T_OPERATING_WEIGHT: string;
  ESTIMATED_USED_RANGE: string;
  OVERALL_SUITABILITY: string;
  HP_BULLETS: Record<BandKey, string[]>;
  TX_CVT: string;
  TX_HYDROSTATIC: string;
  TX_POWERSHIFT: string;
  TX_MANUAL: string;
  WEIGHT_LIGHT: string;
  WEIGHT_LIGHT_SUFFIX: string;
  WEIGHT_HEAVY: string;
  WEIGHT_HEAVY_SUFFIX: string;
  WEIGHT_MID: string;
  PTO_RATED: string;
  PTO_RATED_SUFFIX: string;
  SUITABILITY_TOP: string;
  SUITABILITY_SOLID: string;
  FUEL_EFFICIENCY: string;
  VERSATILITY: string;
  USED_PRICE_RANGE: string;
  LAWN_FOCUS: string;
  FARM_FOCUS: string;
  FARM_BY_BAND: Record<BandKey, string[]>;
  LAWN_BY_BAND: Record<BandKey, string[]>;
  LOADER_HANDLING: string;
  FUEL_CONSCIOUS: string;
  MIXED_TASKS: string;
  NOT_IDEAL_LOADER: string;
  NOT_IDEAL_MAINTENANCE: string;
  NOT_IDEAL_LARGE: string;
  NOT_IDEAL_LIGHT: string;
  TIPS_FARM_1: string;
  TIPS_FARM_2: string;
  TIPS_FARM_3: string;
  TIPS_LAWN_1: string;
  TIPS_LAWN_2: string;
  TIPS_LAWN_3: string;
}> = {
  en: {
    INTRO_LEADS: ['This model sits in the ', 'With its specs, the ', 'Positioned in the ', 'A '],
    POWER_PHRASES: {
      under25: ['compact utility class with engine power suited to property maintenance and light duties.', 'low-horsepower segment ideal for mowing, landscaping, and small-acreage tasks.', 'sub-25 HP band aimed at residential and small commercial use.'],
      '25_60': ['mid-range utility segment capable of loader work, mowing, and medium-acreage farming.', '25–60 HP band suited to mixed use: hay work, grading, and general estate tasks.', 'utility class that balances capability and operating cost for small to mid-size operations.'],
      '60_120': ['high-utility band suited to row-crop, hay, and heavier loader and tillage work.', '60–120 HP range that fits full-time farming and large-property management.', 'mainstream farm segment for fieldwork, feeding, and material handling.'],
      '120_180': ['high-horsepower segment for demanding fieldwork and large-scale operations.', '120–180 HP band suited to heavy tillage, large hay operations, and high-capacity work.', 'high-power class for producers who need strong PTO and hydraulic performance.'],
      '180plus': ['high-horsepower tier for heavy tillage, big balers, and large-acreage efficiency.', '180+ HP segment aimed at maximum productivity and large-implement compatibility.', 'top power band for large farms and contractors who need maximum drawbar and PTO output.'],
    },
    TRANSMISSION_PHRASES: {
      manual: ['Manual transmission keeps ownership costs down and is well understood for maintenance.', 'A manual gearbox offers straightforward operation and lower complexity.', 'Manual transmission is a proven choice for operators who prefer direct gear selection.'],
      hydrostatic: ['Hydrostatic transmission provides smooth, variable control ideal for loader and yard work.', 'Hydrostatic drive allows infinite speed control and easy direction changes.', 'HST offers ease of use for tasks that require frequent speed and direction changes.'],
      powershift: ['Powershift or partial powershift improves productivity in fieldwork with on-the-go shifts.', 'Powershift transmission reduces clutch wear and supports efficient field operation.', 'Powershift capability helps maintain momentum during load and terrain changes.'],
      cvt: ['CVT or continuously variable transmission maximizes efficiency across a wide speed range.', 'CVT allows the engine to operate in an optimal range for fuel and performance.', 'Continuously variable transmission suits operators who want seamless speed adjustment.'],
      unknown: ['Transmission type influences operating style and best use cases.', 'Transmission choice affects durability, efficiency, and ease of operation.'],
    },
    CATEGORY_PHRASES: {
      Farm: ['As a farm tractor, it is built for fieldwork, PTO-driven implements, and all-day reliability.', 'Farm-oriented design prioritizes drawbar and PTO work, hydraulics, and durability.', 'Agricultural use cases include tillage, planting, hay, and material handling.'],
      Lawn: ['As a lawn and garden tractor, it targets mowing, light loader work, and property upkeep.', 'Lawn and garden use focuses on maneuverability, attachment compatibility, and operator comfort.', 'Best suited to residential and light commercial mowing and landscaping.'],
      Industrial: ['Industrial and utility use typically involves loaders, backhoes, and site work.', 'Industrial tractors are often used for construction, landscaping, and material handling.'],
    },
    PTO_PHRASES: ['PTO horsepower and speed options support mowers, hay tools, and other driven implements.', 'Rear PTO capability allows use of mowers, tillers, and other PTO-driven equipment.', 'PTO specs determine compatibility with mowers, balers, and other powered attachments.'],
    NO_PTO_TRADEOFF: 'PTO specs are not listed; verify rear (and front if needed) PTO speed and power before matching implements.',
    WEIGHT_TRADEOFF: 'Published weight is missing; confirm actual weight for transport, stability, and tire ballasting decisions.',
    MAINTENANCE_TRADEOFFS: ['Maintenance complexity is rated on the higher side; factor in service access and parts availability.', 'Suitability scoring suggests above-average maintenance demands; consider repair history and local support.'],
    LOADER_TRADEOFFS: ['Loader suitability scores modestly; check front axle capacity and loader compatibility for heavy material work.', 'Loader and front attachment suitability is limited by design; best for lighter loader duties.'],
    KEY_SPECS_INCLUDE: 'Key specs include ',
    AND: ' and ',
    HP_PTO: ' HP PTO',
    T_OPERATING_WEIGHT: ' t operating weight',
    ESTIMATED_USED_RANGE: 'estimated used range $',
    OVERALL_SUITABILITY: 'overall suitability ',
    HP_BULLETS: {
      under25: ['Compact engine output suits mowing and light loader use.', 'Low horsepower keeps fuel use and noise down.'],
      '25_60': ['Mid-range power fits mixed loader, mowing, and light tillage.', 'Engine size balances capability with operating cost.'],
      '60_120': ['Strong engine power for PTO work and heavy drawbar loads.', 'HP band suits full-season fieldwork and feeding.'],
      '120_180': ['High horsepower supports large implements and high capacity.', 'Engine output suits heavy tillage and large hay equipment.'],
      '180plus': ['Top-tier power for maximum productivity and large implements.', 'High HP supports big balers, heavy tillage, and large acreage.'],
    },
    TX_CVT: 'CVT transmission allows seamless speed adjustment and can improve fuel use.',
    TX_HYDROSTATIC: 'Hydrostatic transmission gives smooth control for loader and yard work.',
    TX_POWERSHIFT: 'Powershift or partial powershift supports efficient fieldwork.',
    TX_MANUAL: 'Manual transmission keeps design simple and ownership costs lower.',
    WEIGHT_LIGHT: 'Operating weight around ',
    WEIGHT_LIGHT_SUFFIX: ' t aids maneuverability and transport.',
    WEIGHT_HEAVY: 'Operating weight around ',
    WEIGHT_HEAVY_SUFFIX: ' t supports traction and ballast for heavy implements.',
    WEIGHT_MID: ' t operating weight fits a broad range of implements and conditions.',
    PTO_RATED: 'Rated PTO output of ',
    PTO_RATED_SUFFIX: ' HP supports mowers, hay tools, and other driven implements.',
    SUITABILITY_TOP: 'Overall suitability scores in the top band for its class.',
    SUITABILITY_SOLID: 'Suitability profile is solid across typical use cases.',
    FUEL_EFFICIENCY: 'Fuel efficiency scores well for its power class.',
    VERSATILITY: 'Versatility index supports a wide range of tasks and attachments.',
    USED_PRICE_RANGE: 'Estimated used price range: $',
    LAWN_FOCUS: 'Lawn and garden focus favors mowing and property maintenance.',
    FARM_FOCUS: 'Farm orientation targets fieldwork, PTO work, and reliability.',
    FARM_BY_BAND: {
      under25: ['Small property maintenance', 'Landscaping and mowing', 'Light material handling'],
      '25_60': ['Small to mid-size hay work', 'Loader and grading', 'Mixed farming and estate use'],
      '60_120': ['Row-crop and hay operations', 'Feeding and material handling', 'Full-season fieldwork'],
      '120_180': ['Heavy tillage and large hay', 'High-capacity harvesting', 'Large-acreage farming'],
      '180plus': ['Maximum productivity fieldwork', 'Large balers and tillage', 'Big-acreage and contractor use'],
    },
    LAWN_BY_BAND: {
      under25: ['Residential mowing', 'Small property upkeep', 'Light towing'],
      '25_60': ['Commercial mowing', 'Estate and park maintenance', 'Light loader work'],
      '60_120': ['Large property mowing', 'Landscaping and grading', 'Multi-use property management'],
      '120_180': ['Large commercial grounds', 'Heavy landscaping', 'Contractor and municipal use'],
      '180plus': [],
    },
    LOADER_HANDLING: 'Loader and material handling',
    FUEL_CONSCIOUS: 'Fuel-conscious operation',
    MIXED_TASKS: 'Mixed tasks and attachment use',
    NOT_IDEAL_LOADER: 'Heavy, continuous loader work',
    NOT_IDEAL_MAINTENANCE: 'Low-maintenance-first buyers',
    NOT_IDEAL_LARGE: 'Large-acreage row-crop or heavy tillage',
    NOT_IDEAL_LIGHT: 'Light-duty or compact-property-only use',
    TIPS_FARM_1: 'Check engine and PTO hours; service history matters for long-term reliability.',
    TIPS_FARM_2: 'Confirm PTO speed (540/1000) and HP match your mowers, balers, or other implements.',
    TIPS_FARM_3: 'Inspect hydraulics and three-point hitch condition; repair costs can be high.',
    TIPS_LAWN_1: 'Verify mower deck or attachment compatibility and condition.',
    TIPS_LAWN_2: 'Check for oil leaks and transmission operation; HST repairs are costly.',
    TIPS_LAWN_3: 'Confirm tire condition and that the machine fits your storage and access.',
  },
  es: {
    INTRO_LEADS: ['Este modelo se sitúa en la ', 'Con sus especificaciones, el ', 'Posicionado en la ', 'Un '],
    POWER_PHRASES: {
      under25: ['clase utilitaria compacta con potencia para mantenimiento de fincas y tareas ligeras.', 'segmento de baja potencia ideal para siega, paisajismo y pequeñas superficies.', 'banda de menos de 25 CV orientada a uso residencial y comercial pequeño.'],
      '25_60': ['segmento utilitario medio capaz de trabajo con pala, siega y agricultura en superficies medianas.', 'banda 25–60 CV adecuada para uso mixto: forraje, nivelación y tareas de finca.', 'clase utilitaria que equilibra capacidad y coste de explotación en operaciones pequeñas y medianas.'],
      '60_120': ['banda de alta utilidad para cultivos en hilera, forraje y trabajo con pala y labranza.', 'rango 60–120 CV que encaja con agricultura a tiempo completo y gestión de grandes superficies.', 'segmento agrícola principal para trabajo de campo, alimentación y manejo de materiales.'],
      '120_180': ['segmento de alta potencia para trabajo de campo exigente y operaciones a gran escala.', 'banda 120–180 CV adecuada para labranza pesada, forraje a gran escala y alta capacidad.', 'clase de alta potencia para productores que necesitan buen TDF e hidráulica.'],
      '180plus': ['nivel de alta potencia para labranza pesada, grandes empacadoras y eficiencia en grandes superficies.', 'segmento de más de 180 CV orientado a máxima productividad y compatibilidad con implementos grandes.', 'banda de máxima potencia para grandes explotaciones y contratistas.'],
    },
    TRANSMISSION_PHRASES: {
      manual: ['La transmisión manual mantiene los costes de propiedad bajos y es fácil de mantener.', 'Una caja manual ofrece operación directa y menor complejidad.', 'La transmisión manual es una opción probada para quien prefiere selección directa de marchas.'],
      hydrostatic: ['La transmisión hidrostática ofrece control suave y variable ideal para pala y trabajo en patio.', 'La hidrostática permite control infinito de velocidad y cambios de dirección fáciles.', 'La HST facilita tareas que requieren cambios frecuentes de velocidad y dirección.'],
      powershift: ['La powershift o parcial mejora la productividad en campo con cambios en marcha.', 'La transmisión powershift reduce desgaste del embrague y favorece el trabajo en campo.', 'La powershift ayuda a mantener el ritmo ante cambios de carga y terreno.'],
      cvt: ['La CVT o transmisión continuamente variable maximiza la eficiencia en todo el rango de velocidades.', 'La CVT permite que el motor trabaje en un rango óptimo de consumo y rendimiento.', 'La transmisión continuamente variable se adapta a quien busca ajuste de velocidad sin saltos.'],
      unknown: ['El tipo de transmisión influye en el estilo de uso y los mejores casos de uso.', 'La elección de transmisión afecta a durabilidad, eficiencia y facilidad de uso.'],
    },
    CATEGORY_PHRASES: {
      Farm: ['Como tractor agrícola, está pensado para trabajo de campo, implementos a TDF y fiabilidad diaria.', 'Diseño agrícola que prioriza trabajo a la barra y TDF, hidráulica y durabilidad.', 'Casos de uso: labranza, siembra, forraje y manejo de materiales.'],
      Lawn: ['Como tractor de jardín, se orienta a siega, trabajo ligero con pala y mantenimiento de la propiedad.', 'Uso jardín y parcela: maniobrabilidad, compatibilidad de accesorios y comodidad del operador.', 'Adecuado para siega residencial y comercial ligera.'],
      Industrial: ['Uso industrial y utilitario: palas, retroexcavadoras y trabajo en obra.', 'Los tractores industriales se usan en construcción, paisajismo y manejo de materiales.'],
    },
    PTO_PHRASES: ['La potencia y velocidad del TDF permiten usar segadoras, equipos de forraje y otros implementos.', 'El TDF trasero permite usar segadoras, cultivadores y otro equipo accionado por TDF.', 'Las especificaciones del TDF determinan la compatibilidad con segadoras, empacadoras y otros equipos.'],
    NO_PTO_TRADEOFF: 'No se indican datos de TDF; compruebe velocidad y potencia del TDF trasero (y delantero si aplica) antes de acoplar implementos.',
    WEIGHT_TRADEOFF: 'No se indica el peso; confirme el peso real para transporte, estabilidad y lastrado.',
    MAINTENANCE_TRADEOFFS: ['La complejidad de mantenimiento se valora por encima de la media; tenga en cuenta acceso al servicio y disponibilidad de piezas.', 'La puntuación de adecuación sugiere demandas de mantenimiento por encima de la media; valore historial y soporte local.'],
    LOADER_TRADEOFFS: ['La adecuación para pala es moderada; compruebe capacidad del eje delantero y compatibilidad para trabajo pesado.', 'La adecuación para pala y accesorios delanteros está limitada por diseño; mejor para tareas ligeras con pala.'],
    KEY_SPECS_INCLUDE: 'Datos clave: ',
    AND: ' y ',
    HP_PTO: ' CV TDF',
    T_OPERATING_WEIGHT: ' t de peso en orden de trabajo',
    ESTIMATED_USED_RANGE: 'rango de ocasión estimado $',
    OVERALL_SUITABILITY: 'adecuación global ',
    HP_BULLETS: {
      under25: ['Potencia compacta adecuada para siega y uso ligero con pala.', 'Baja potencia reduce consumo y ruido.'],
      '25_60': ['Potencia media para pala, siega y labranza ligera.', 'Tamaño de motor que equilibra capacidad y coste.'],
      '60_120': ['Buena potencia para TDF y cargas a la barra.', 'Banda de CV adecuada para trabajo de campo y alimentación.'],
      '120_180': ['Alta potencia para implementos grandes y alta capacidad.', 'Motor adecuado para labranza pesada y forraje.'],
      '180plus': ['Máxima potencia para productividad e implementos grandes.', 'Alta CV para empacadoras, labranza pesada y grandes superficies.'],
    },
    TX_CVT: 'La transmisión CVT permite ajuste continuo de velocidad y puede mejorar el consumo.',
    TX_HYDROSTATIC: 'La hidrostática ofrece control suave para pala y trabajo en patio.',
    TX_POWERSHIFT: 'La powershift o parcial favorece el trabajo eficiente en campo.',
    TX_MANUAL: 'La transmisión manual simplifica el diseño y reduce costes de propiedad.',
    WEIGHT_LIGHT: 'Peso en orden de trabajo de unas ',
    WEIGHT_LIGHT_SUFFIX: ' t favorece maniobrabilidad y transporte.',
    WEIGHT_HEAVY: 'Peso en orden de trabajo de unas ',
    WEIGHT_HEAVY_SUFFIX: ' t favorece tracción y lastrado para implementos pesados.',
    WEIGHT_MID: ' t se adapta a una amplia gama de implementos y condiciones.',
    PTO_RATED: 'TDF nominal de ',
    PTO_RATED_SUFFIX: ' HP para segadoras, equipos de forraje y otros implementos.',
    SUITABILITY_TOP: 'La adecuación global queda en la banda alta para su clase.',
    SUITABILITY_SOLID: 'El perfil de adecuación es sólido en los casos de uso típicos.',
    FUEL_EFFICIENCY: 'La eficiencia de combustible puntúa bien para su clase de potencia.',
    VERSATILITY: 'El índice de versatilidad favorece muchas tareas y accesorios.',
    USED_PRICE_RANGE: 'Rango de precio de ocasión estimado: $',
    LAWN_FOCUS: 'Orientación jardín: siega y mantenimiento de la propiedad.',
    FARM_FOCUS: 'Orientación agrícola: trabajo de campo, TDF y fiabilidad.',
    FARM_BY_BAND: {
      under25: ['Mantenimiento de pequeñas propiedades', 'Paisajismo y siega', 'Manejo ligero de materiales'],
      '25_60': ['Forraje en superficies pequeñas y medianas', 'Pala y nivelación', 'Uso mixto agrícola y finca'],
      '60_120': ['Cultivos en hilera y forraje', 'Alimentación y manejo de materiales', 'Trabajo de campo a tiempo completo'],
      '120_180': ['Labranza pesada y forraje a gran escala', 'Cosecha de alta capacidad', 'Grandes superficies'],
      '180plus': ['Máxima productividad en campo', 'Grandes empacadoras y labranza', 'Grandes superficies y contratistas'],
    },
    LAWN_BY_BAND: {
      under25: ['Siega residencial', 'Mantenimiento de pequeñas propiedades', 'Remolque ligero'],
      '25_60': ['Siega comercial', 'Mantenimiento de parques y fincas', 'Pala ligera'],
      '60_120': ['Siega en grandes superficies', 'Paisajismo y nivelación', 'Gestión multifunción'],
      '120_180': ['Grandes superficies comerciales', 'Paisajismo pesado', 'Contratistas y uso municipal'],
      '180plus': [],
    },
    LOADER_HANDLING: 'Pala y manejo de materiales',
    FUEL_CONSCIOUS: 'Operación con bajo consumo',
    MIXED_TASKS: 'Tareas mixtas y uso de accesorios',
    NOT_IDEAL_LOADER: 'Trabajo intensivo y continuo con pala',
    NOT_IDEAL_MAINTENANCE: 'Compradores que priorizan bajo mantenimiento',
    NOT_IDEAL_LARGE: 'Grandes superficies de cultivo o labranza pesada',
    NOT_IDEAL_LIGHT: 'Uso ligero o solo en propiedades compactas',
    TIPS_FARM_1: 'Compruebe horas de motor y TDF; el historial de mantenimiento importa para la fiabilidad.',
    TIPS_FARM_2: 'Confirme que la velocidad del TDF (540/1000) y la potencia coinciden con segadoras, empacadoras u otros implementos.',
    TIPS_FARM_3: 'Revise hidráulica y enganche de tres puntos; las reparaciones pueden ser caras.',
    TIPS_LAWN_1: 'Verifique compatibilidad y estado del equipo de corte o accesorios.',
    TIPS_LAWN_2: 'Compruebe fugas de aceite y funcionamiento de la transmisión; las reparaciones de HST son costosas.',
    TIPS_LAWN_3: 'Confirme el estado de los neumáticos y que la máquina cabe en su almacén y accesos.',
  },
};

function phrases(locale: NarrativeLocale) {
  return PHRASES[locale] ?? PHRASES.en;
}

function buildSummary(input: TractorNarrativeInput, seed: number, locale: NarrativeLocale): string {
  const p = phrases(locale);
  const hp = input.hp ?? 0;
  const band = (hp > 0 ? powerBand(hp) : '25_60') as BandKey;
  const cat: CategoryKey = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : input.category === 'industrial' || input.category === 'Industrial' ? 'Industrial' : 'Farm';
  const txType = (input.transmissionType || 'manual').toLowerCase();
  const txKey = TRANSMISSION_LABELS[txType] ? txType : 'unknown';

  const powerPhrases = p.POWER_PHRASES[band] || p.POWER_PHRASES['25_60'];
  const powerClause = pick(powerPhrases, seed, 1);
  const txPhrases = p.TRANSMISSION_PHRASES[txKey] || p.TRANSMISSION_PHRASES.unknown;
  const txClause = pick(txPhrases, seed, 2);
  const catPhrases = p.CATEGORY_PHRASES[cat] || p.CATEGORY_PHRASES.Farm;
  const catClause = pick(catPhrases, seed, 3);

  const lead = pick(p.INTRO_LEADS, seed, 0);
  const firstSentence = lead.endsWith(' ') ? lead + powerClause : lead + powerClause;
  const parts: string[] = [firstSentence, txClause, catClause];

  if (input.ptoHP != null && input.ptoHP > 0) {
    parts.push(pick(p.PTO_PHRASES, seed, 4));
  }

  const numericFacts: string[] = [];
  if (hp > 0) numericFacts.push(`${hp} HP`);
  if (input.ptoHP != null && input.ptoHP > 0) numericFacts.push(`${input.ptoHP}${p.HP_PTO}`);
  if (input.weightKg != null && input.weightKg > 0) numericFacts.push(`${Math.round(input.weightKg / 1000)}${p.T_OPERATING_WEIGHT}`);
  if (input.usedMin != null && input.usedMax != null) numericFacts.push(`${p.ESTIMATED_USED_RANGE}${input.usedMin.toLocaleString()}–$${input.usedMax.toLocaleString()}`);
  const overall = input.suitability?.overallScore;
  if (overall != null && overall >= 0) numericFacts.push(`${p.OVERALL_SUITABILITY}${Math.round(overall)}/100`);

  if (numericFacts.length > 0) {
    const factClause = numericFacts.length <= 2
      ? numericFacts.join(p.AND)
      : numericFacts.slice(0, -1).join(', ') + ', ' + p.AND + numericFacts[numericFacts.length - 1];
    parts.push(p.KEY_SPECS_INCLUDE + factClause + '.');
  }

  return parts.join(' ');
}

function buildHighlights(input: TractorNarrativeInput, seed: number, locale: NarrativeLocale): string[] {
  const p = phrases(locale);
  const out: string[] = [];
  const hp = input.hp ?? 0;
  const band = (hp > 0 ? powerBand(hp) : '25_60') as BandKey;
  const cat: CategoryKey = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : input.category === 'industrial' || input.category === 'Industrial' ? 'Industrial' : 'Farm';

  if (hp > 0) {
    out.push(pick(p.HP_BULLETS[band] || p.HP_BULLETS['25_60'], seed, 10));
  }

  if (input.transmissionType) {
    const tx = input.transmissionType.toLowerCase();
    if (tx === 'cvt') out.push(p.TX_CVT);
    else if (tx === 'hydrostatic') out.push(p.TX_HYDROSTATIC);
    else if (tx === 'powershift') out.push(p.TX_POWERSHIFT);
    else out.push(p.TX_MANUAL);
  }

  if (input.weightKg != null && input.weightKg > 0) {
    const tons = Math.round(input.weightKg / 1000);
    const wBand = weightBand(input.weightKg);
    if (wBand === 'light') out.push(p.WEIGHT_LIGHT + tons + p.WEIGHT_LIGHT_SUFFIX);
    else if (wBand === 'heavy') out.push(p.WEIGHT_HEAVY + tons + p.WEIGHT_HEAVY_SUFFIX);
    else out.push(tons + p.WEIGHT_MID);
  }

  if (input.ptoHP != null && input.ptoHP > 0) {
    out.push(p.PTO_RATED + input.ptoHP + p.PTO_RATED_SUFFIX);
  }

  const suit = input.suitability;
  if (suit?.overallScore != null) {
    const sBand = scoreBand(suit.overallScore);
    if (sBand === 'high') out.push(p.SUITABILITY_TOP);
    else if (sBand === 'medium') out.push(p.SUITABILITY_SOLID);
  }
  if (suit?.fuelEfficiency != null && suit.fuelEfficiency >= 70) out.push(p.FUEL_EFFICIENCY);
  if (suit?.versatility != null && suit.versatility >= 70) out.push(p.VERSATILITY);

  if (input.usedMin != null && input.usedMax != null) {
    out.push(p.USED_PRICE_RANGE + input.usedMin.toLocaleString() + '–$' + input.usedMax.toLocaleString() + ' USD.');
  }

  if (cat === 'Lawn') out.push(p.LAWN_FOCUS);
  else if (cat === 'Farm') out.push(p.FARM_FOCUS);

  const seen = new Set<string>();
  return out.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 8);
}

function buildTradeoffs(input: TractorNarrativeInput, locale: NarrativeLocale): string[] {
  const p = phrases(locale);
  const out: string[] = [];
  if (input.ptoHP == null && input.ptoRPM == null) out.push(p.NO_PTO_TRADEOFF);
  if (input.weightKg == null || input.weightKg <= 0) out.push(p.WEIGHT_TRADEOFF);
  const maint = input.suitability?.maintenance;
  if (maint != null && maint < 55) out.push(pick(p.MAINTENANCE_TRADEOFFS, fnv1a(input.fullName), 0));
  const loader = input.suitability?.loaderWork;
  if (loader != null && loader < 55) out.push(pick(p.LOADER_TRADEOFFS, fnv1a(input.fullName), 1));
  return out.slice(0, 3);
}

function buildBestFor(input: TractorNarrativeInput, seed: number, locale: NarrativeLocale): string[] {
  const p = phrases(locale);
  const hp = input.hp ?? 0;
  const band = (hp > 0 ? powerBand(hp) : '25_60') as BandKey;
  const cat: CategoryKey = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : input.category === 'industrial' || input.category === 'Industrial' ? 'Industrial' : 'Farm';
  const suit = input.suitability;

  const base = cat === 'Lawn' ? (p.LAWN_BY_BAND[band] || p.LAWN_BY_BAND['25_60']) : (p.FARM_BY_BAND[band] || p.FARM_BY_BAND['25_60']);
  const out = [...base];

  if (suit?.loaderWork != null && suit.loaderWork >= 65) out.push(p.LOADER_HANDLING);
  if (suit?.fuelEfficiency != null && suit.fuelEfficiency >= 70) out.push(p.FUEL_CONSCIOUS);
  if (suit?.versatility != null && suit.versatility >= 70) out.push(p.MIXED_TASKS);

  const seen = new Set<string>();
  return out.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 5);
}

function buildNotIdealFor(input: TractorNarrativeInput, _seed: number, locale: NarrativeLocale): string[] {
  const p = phrases(locale);
  const hp = input.hp ?? 0;
  const band = (hp > 0 ? powerBand(hp) : '25_60') as BandKey;
  const suit = input.suitability;
  const out: string[] = [];

  if (suit?.loaderWork != null && suit.loaderWork < 50) out.push(p.NOT_IDEAL_LOADER);
  if (suit?.maintenance != null && suit.maintenance < 50) out.push(p.NOT_IDEAL_MAINTENANCE);
  if (band === 'under25' || band === '25_60') out.push(p.NOT_IDEAL_LARGE);
  if (band === '180plus') out.push(p.NOT_IDEAL_LIGHT);

  const seen = new Set<string>();
  return out.filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  }).slice(0, 4);
}

function buildBuyingTips(input: TractorNarrativeInput, _seed: number, locale: NarrativeLocale): string[] {
  const p = phrases(locale);
  const cat = input.category === 'lawn' || input.category === 'Lawn' ? 'Lawn' : 'Farm';
  const hasPTO = input.ptoHP != null || input.ptoRPM != null;
  const tips: string[] = [];

  if (cat === 'Farm') {
    tips.push(p.TIPS_FARM_1);
    if (hasPTO) tips.push(p.TIPS_FARM_2);
    tips.push(p.TIPS_FARM_3);
  } else {
    tips.push(p.TIPS_LAWN_1, p.TIPS_LAWN_2, p.TIPS_LAWN_3);
  }
  return tips.slice(0, 3);
}

export function buildTractorNarrative(input: TractorNarrativeInput, locale: NarrativeLocale = 'en'): TractorNarrative {
  const seed = seedFrom(input);

  return {
    summary: buildSummary(input, seed, locale),
    highlights: buildHighlights(input, seed, locale),
    tradeoffs: buildTradeoffs(input, locale),
    bestFor: buildBestFor(input, seed, locale),
    notIdealFor: buildNotIdealFor(input, seed, locale),
    buyingTips: buildBuyingTips(input, seed, locale),
  };
}
