#!/usr/bin/env tsx
/**
 * TractorFit™ build pipeline step 2: compute scores per tractor, write per-tractor JSON + indexes.
 * Run after buildDataset. Run from project root: tsx scripts/buildSuitability.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { specsFromTractor, computeSuitability } from '../lib/tractorSuitability';
import { buildTractorFitJson } from '../lib/tractorFit/scoring';
import type { TractorMin, SlugsFile, IndexEntry } from '../lib/tractorFit/types';
import { sanitizeTractorId } from '../lib/tractorFit/utils';

const DATA_DIR = path.join(process.cwd(), 'data');
const TRACTORS_DIR = path.join(DATA_DIR, 'tractors');
const INDEXES_DIR = path.join(DATA_DIR, 'indexes');
const MIN_PATH = path.join(DATA_DIR, 'tractors.min.json');
const SLUGS_PATH = path.join(DATA_DIR, 'slugs.json');

function brandToSlug(brand: string): string {
  return brand
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function hpBucket(hp: number): string {
  if (hp < 40) return '0-40';
  if (hp < 60) return '40-60';
  if (hp < 100) return '60-100';
  if (hp < 150) return '100-150';
  return '150-plus';
}

async function main() {
  if (!fs.existsSync(MIN_PATH)) {
    console.error('Run buildDataset.ts first. Missing:', MIN_PATH);
    process.exit(1);
  }

  const minList: TractorMin[] = JSON.parse(fs.readFileSync(MIN_PATH, 'utf-8'));
  const slugsData: SlugsFile = JSON.parse(fs.readFileSync(SLUGS_PATH, 'utf-8'));

  if (!fs.existsSync(TRACTORS_DIR)) fs.mkdirSync(TRACTORS_DIR, { recursive: true });
  if (!fs.existsSync(INDEXES_DIR)) fs.mkdirSync(INDEXES_DIR, { recursive: true });

  const brandIndex: Record<string, IndexEntry[]> = {};
  const hpIndex: Record<string, IndexEntry[]> = {};
  const topLoader: IndexEntry[] = [];
  const topSmallFarm: IndexEntry[] = [];
  const topLargeFarm: IndexEntry[] = [];
  const topFuelEfficiency: IndexEntry[] = [];
  const topVersatility: IndexEntry[] = [];
  const under60Hp: IndexEntry[] = [];
  const hp100Class: IndexEntry[] = [];
  const TOP_N = 100;

  let done = 0;
  for (const min of minList) {
    const specs = specsFromTractor(min as Parameters<typeof specsFromTractor>[0]);
    const result = computeSuitability(specs, `${min.brand} ${min.model}`);
    const json = buildTractorFitJson(min, specs, result);

    const safeId = sanitizeTractorId(min.id);
    fs.writeFileSync(
      path.join(TRACTORS_DIR, `${safeId}.json`),
      JSON.stringify(json, null, 0),
      'utf-8'
    );

    const entry: IndexEntry = {
      id: min.id,
      slug: min.slug,
      score: result.overallScore,
      brand: min.brand,
      model: min.model,
      powerHP: min.engine.powerHP,
    };

    const bSlug = brandToSlug(min.brand);
    if (!brandIndex[bSlug]) brandIndex[bSlug] = [];
    brandIndex[bSlug].push({ ...entry, score: result.overallScore });

    const bucket = hpBucket(min.engine.powerHP);
    if (!hpIndex[bucket]) hpIndex[bucket] = [];
    hpIndex[bucket].push(entry);

    topLoader.push({ ...entry, score: result.loaderScore });
    topSmallFarm.push({ ...entry, score: result.smallFarmScore });
    topLargeFarm.push({ ...entry, score: result.largeFarmScore });
    topFuelEfficiency.push({ ...entry, score: result.fuelEfficiency });
    topVersatility.push({ ...entry, score: result.versatilityIndex });

    if (min.engine.powerHP < 60)
      under60Hp.push({ ...entry, score: result.smallFarmScore });
    if (min.engine.powerHP >= 90 && min.engine.powerHP <= 120)
      hp100Class.push({ ...entry, score: result.overallScore });

    done++;
    if (done % 1000 === 0) console.log(`Processed ${done}/${minList.length}`);
  }

  topLoader.sort((a, b) => b.score - a.score);
  topSmallFarm.sort((a, b) => b.score - a.score);
  topLargeFarm.sort((a, b) => b.score - a.score);
  topFuelEfficiency.sort((a, b) => b.score - a.score);
  topVersatility.sort((a, b) => b.score - a.score);

  for (const slug of Object.keys(brandIndex)) {
    brandIndex[slug].sort((a, b) => b.score - a.score);
    fs.writeFileSync(
      path.join(INDEXES_DIR, `brand-${slug}.json`),
      JSON.stringify(brandIndex[slug].slice(0, 500), null, 0),
      'utf-8'
    );
  }

  for (const bucket of Object.keys(hpIndex)) {
    hpIndex[bucket].sort((a, b) => b.score - a.score);
    fs.writeFileSync(
      path.join(INDEXES_DIR, `hp-${bucket}.json`),
      JSON.stringify(hpIndex[bucket], null, 0),
      'utf-8'
    );
  }

  fs.writeFileSync(
    path.join(INDEXES_DIR, 'top-loader.json'),
    JSON.stringify(topLoader.slice(0, TOP_N), null, 0),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(INDEXES_DIR, 'top-small-farm.json'),
    JSON.stringify(topSmallFarm.slice(0, TOP_N), null, 0),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(INDEXES_DIR, 'top-large-farm.json'),
    JSON.stringify(topLargeFarm.slice(0, TOP_N), null, 0),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(INDEXES_DIR, 'top-fuel-efficiency.json'),
    JSON.stringify(topFuelEfficiency.slice(0, TOP_N), null, 0),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(INDEXES_DIR, 'top-versatility.json'),
    JSON.stringify(topVersatility.slice(0, TOP_N), null, 0),
    'utf-8'
  );

  under60Hp.sort((a, b) => b.score - a.score);
  hp100Class.sort((a, b) => b.score - a.score);
  fs.writeFileSync(
    path.join(INDEXES_DIR, 'under-60-hp.json'),
    JSON.stringify(under60Hp.slice(0, TOP_N), null, 0),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(INDEXES_DIR, '100-hp.json'),
    JSON.stringify(hp100Class.slice(0, TOP_N), null, 0),
    'utf-8'
  );

  console.log(`Wrote ${minList.length} tractor JSONs to ${TRACTORS_DIR}`);
  console.log(`Wrote brand/hp and top-* indexes to ${INDEXES_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
