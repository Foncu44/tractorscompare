#!/usr/bin/env tsx
/**
 * Best Tractors index builder. Loads all tractors + TractorFit, filters/ranks per category,
 * writes data/indexes/best-{slug}.json. Deterministic, no external calls.
 *
 * Usage:
 *   npx tsx scripts/buildBestIndexes.ts   # or: npm run build:best-indexes
 *   npm run prebuild                      # runs this before next build
 * Requires: data/slugs.json and data/tractors/*.json (run buildDataset + buildSuitability first).
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  BEST_CATEGORIES,
  getFilterRules,
  normalizeTransmission,
  type BestCategoryDef,
  type BestIndexFile,
  type BestIndexItem,
  type BestIndexStats,
  type FilterRules,
  type RankingMethod,
  type TractorFitScoreKey,
} from '../lib/bestCategories';
import type { TractorFitJson, TractorFitScores } from '../lib/tractorFit/types';
import { sanitizeTractorId, tryParseJson } from '../lib/tractorFit/utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRACTORS_DIR = path.join(DATA_DIR, 'tractors');
const INDEXES_DIR = path.join(DATA_DIR, 'indexes');
const SLUGS_PATH = path.join(DATA_DIR, 'slugs.json');
const TOP_N = 20;
const REASONS_COUNT = 3;

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

function matchesFilters(t: TractorFitJson, rules: FilterRules): boolean {
  const hp = t.specs?.powerHP ?? 0;
  const weight = t.specs?.weightKg;
  const scores = t.tractorFit ?? ({} as TractorFitScores);
  const transNorm = normalizeTransmission(t.specs?.transmissionType ?? '');

  if (rules.minHp != null && hp < rules.minHp) return false;
  if (rules.maxHp != null && hp > rules.maxHp) return false;
  if (rules.minWeight != null && (weight == null || weight < rules.minWeight)) return false;
  if (rules.maxWeight != null && weight != null && weight > rules.maxWeight) return false;
  if (rules.minLoaderScore != null && (scores.loaderScore == null || scores.loaderScore < rules.minLoaderScore)) return false;
  if (rules.minSmallFarmScore != null && (scores.smallFarmScore == null || scores.smallFarmScore < rules.minSmallFarmScore)) return false;
  if (rules.minLargeFarmScore != null && (scores.largeFarmScore == null || scores.largeFarmScore < rules.minLargeFarmScore)) return false;
  if (rules.minFuelEfficiency != null && (scores.fuelEfficiencyIndex == null || scores.fuelEfficiencyIndex < rules.minFuelEfficiency)) return false;
  if (rules.maxMaintenanceComplexity != null && scores.maintenanceComplexity != null && scores.maintenanceComplexity > rules.maxMaintenanceComplexity) return false;
  if (rules.minVersatility != null && (scores.versatilityIndex == null || scores.versatilityIndex < rules.minVersatility)) return false;
  if (rules.minPowerToWeight != null && (scores.powerToWeightScore == null || scores.powerToWeightScore < rules.minPowerToWeight)) return false;
  if (rules.transmissionTypes != null && rules.transmissionTypes.length > 0) {
    const allowed = new Set(rules.transmissionTypes.map((x) => normalizeTransmission(x)));
    if (!allowed.has(transNorm)) return false;
  }
  if (rules.types != null && rules.types.length > 0) {
    const tt = (t.type ?? '').toLowerCase();
    if (!rules.types.some((x) => x.toLowerCase() === tt)) return false;
  }
  return true;
}

function computeCategoryScore(
  scores: TractorFitScores,
  method: RankingMethod,
  slug: string
): number {
  if (slug === 'best-value') {
    const overall = scores.overallScore ?? 0;
    const fuel = scores.fuelEfficiencyIndex ?? 0;
    const maint = scores.maintenanceComplexity ?? 50;
    return overall * 0.5 + fuel * 0.25 + (100 - maint) * 0.25;
  }
  let sum = 0;
  let totalWeight = 0;
  for (const [key, w] of Object.entries(method.weights)) {
    if (w == null || w <= 0) continue;
    const v = scores[key as TractorFitScoreKey];
    if (typeof v === 'number') {
      sum += v * w;
      totalWeight += w;
    }
  }
  return totalWeight > 0 ? sum / totalWeight : (scores.overallScore ?? 0);
}

/** Deterministic reasons from TractorFit: whyThisScore and pros, then score-based fallbacks. */
function buildReasons(t: TractorFitJson, count: number): [string, string, string] {
  const out: string[] = [];
  const why = t.whyThisScore ?? [];
  const pros = t.pros ?? [];
  const scores = t.tractorFit;
  const overall = scores?.overallScore ?? 0;
  const loader = scores?.loaderScore;
  const smallFarm = scores?.smallFarmScore;
  const versatility = scores?.versatilityIndex;

  for (const s of why) {
    if (out.length >= count) break;
    const trimmed = (s ?? '').trim().slice(0, 220);
    if (trimmed) out.push(trimmed);
  }
  for (const s of pros) {
    if (out.length >= count) break;
    const trimmed = (s ?? '').trim().slice(0, 220);
    if (trimmed) out.push(trimmed);
  }
  while (out.length < count) {
    if (out.length === 0 && typeof overall === 'number')
      out.push(`Overall TractorFit™ score ${overall}/100.`);
    else if (out.length === 1 && typeof loader === 'number')
      out.push(`Loader score ${loader}/100: hydraulic flow and lift capacity.`);
    else if (out.length <= 2 && typeof smallFarm === 'number')
      out.push(`Small-farm suitability ${smallFarm}/100.`);
    else if (out.length <= 2 && typeof versatility === 'number')
      out.push(`Versatility index ${versatility}/100.`);
    else
      out.push(`TractorFit™ overall ${overall}/100.`);
  }
  return [out[0]!, out[1]!, out[2]!];
}

function loadAllTractors(entries: { id: string; slug: string }[]): TractorFitJson[] {
  const list: TractorFitJson[] = [];
  for (const { id } of entries) {
    const safeId = sanitizeTractorId(id);
    const filePath = path.join(TRACTORS_DIR, `${safeId}.json`);
    try {
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const json = tryParseJson<TractorFitJson>(raw);
      if (json && json.id && json.tractorFit) list.push(json);
    } catch {
      // skip
    }
  }
  return list;
}

function buildIndexForCategory(
  tractors: TractorFitJson[],
  cat: BestCategoryDef
): BestIndexFile {
  const rules = getFilterRules(cat);
  const eligible = tractors.filter((t) => matchesFilters(t, rules));
  const withScore = eligible.map((t) => ({
    t,
    categoryScore: computeCategoryScore(t.tractorFit!, cat.rankingMethod, cat.slug),
  }));
  withScore.sort((a, b) => b.categoryScore - a.categoryScore);
  const top = withScore.slice(0, TOP_N);

  const items: BestIndexItem[] = top.map(({ t, categoryScore }) => {
    const hp = t.specs?.powerHP ?? null;
    const ptoHP = t.specs?.ptoHP ?? null;
    const weightKg = t.specs?.weightKg ?? null;
    const name = [t.brand, t.model].filter(Boolean).join(' ') || t.slug;
    return {
      id: t.id,
      slug: t.slug,
      name,
      brand: t.brand ?? '',
      hp: typeof hp === 'number' ? hp : null,
      ptoHP: typeof ptoHP === 'number' ? ptoHP : null,
      weightKg: typeof weightKg === 'number' && weightKg > 0 ? weightKg : null,
      overallScore: t.tractorFit!.overallScore ?? 0,
      categoryScore: Math.round(categoryScore * 10) / 10,
      reasons: buildReasons(t, REASONS_COUNT),
    };
  });

  const hpList = top.map(({ t }) => t.specs?.powerHP).filter((n): n is number => typeof n === 'number');
  const weightList = top.map(({ t }) => t.specs?.weightKg).filter((n): n is number => typeof n === 'number' && n > 0);
  const ptoList = top.map(({ t }) => t.specs?.ptoHP).filter((n): n is number => typeof n === 'number');
  const powerToWeightList = top
    .map(({ t }) => {
      const hp = t.specs?.powerHP;
      const w = t.specs?.weightKg;
      if (typeof hp === 'number' && typeof w === 'number' && w > 0) return hp / (w / 1000);
      return null;
    })
    .filter((n): n is number => typeof n === 'number');

  const totalWithPto = top.filter(({ t }) => typeof t.specs?.ptoHP === 'number').length;
  const ptoCoveragePct = top.length ? Math.round((totalWithPto / top.length) * 100) : 0;
  const rawPowerToWeight = median(powerToWeightList);
  const medianPowerToWeight = rawPowerToWeight != null ? Math.round(rawPowerToWeight * 10) / 10 : null;

  const stats: BestIndexStats = {
    count: items.length,
    medianHP: median(hpList),
    medianWeightKg: median(weightList),
    medianPtoHP: median(ptoList),
    medianPowerToWeight,
    ptoCoveragePct,
  };

  const today = new Date().toISOString().slice(0, 10);
  return {
    category: { slug: cat.slug, title: cat.title },
    updatedAt: today,
    stats,
    items,
  };
}

async function main() {
  if (!fs.existsSync(SLUGS_PATH)) {
    console.error('Missing slugs.json. Run buildDataset and buildSuitability first.');
    process.exit(1);
  }
  const slugsData = tryParseJson<{ entries: { id: string; slug: string }[] }>(
    fs.readFileSync(SLUGS_PATH, 'utf-8')
  );
  if (!slugsData?.entries?.length) {
    console.error('slugs.json has no entries.');
    process.exit(1);
  }

  if (!fs.existsSync(TRACTORS_DIR)) {
    console.error('Missing data/tractors. Run buildSuitability first.');
    process.exit(1);
  }
  if (!fs.existsSync(INDEXES_DIR)) fs.mkdirSync(INDEXES_DIR, { recursive: true });

  console.log('Loading tractor JSONs...');
  const tractors = loadAllTractors(slugsData.entries);
  console.log(`Loaded ${tractors.length} tractors with TractorFit data.`);

  for (const cat of BEST_CATEGORIES) {
    const index = buildIndexForCategory(tractors, cat);
    const outPath = path.join(INDEXES_DIR, `best-${cat.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(index, null, 0), 'utf-8');
    console.log(`Wrote ${outPath} (${index.items.length} items).`);
  }

  console.log('Done. Best category indexes written to data/indexes/.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
