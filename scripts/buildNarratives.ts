#!/usr/bin/env tsx
/**
 * Precompute deterministic tractor narratives and write data/narratives.json.
 * Run before build for faster page generation (optional: page falls back to runtime build).
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TractorNarrative } from '../lib/tractorNarrative';
import { buildTractorNarrative } from '../lib/tractorNarrative';
import { estimateUsedPrice } from '../lib/usedPriceEstimate';
import { specsFromTractor, computeSuitability } from '../lib/tractorSuitability';
import type { Tractor } from '../types/tractor';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUT_JSON = path.join(DATA_DIR, 'narratives.json');

async function main() {
  const { tractors } = await import('../data/tractors');
  const list = tractors as Tractor[];
  const map: Record<string, TractorNarrative> = {};
  let done = 0;
  const total = list.length;

  for (const tractor of list) {
    const fullName = `${tractor.brand} ${tractor.model}`;
    const specs = specsFromTractor(tractor);
    const suitabilityResult = computeSuitability(specs, fullName);
    const usedEstimate = estimateUsedPrice({
      category: tractor.type === 'farm' ? 'Farm' : tractor.type === 'lawn' ? 'Lawn' : 'Industrial',
      powerHP: tractor.engine.powerHP,
      priceMin: tractor.priceRange?.min ?? null,
      priceMax: tractor.priceRange?.max ?? null,
    });
    const narrative = buildTractorNarrative({
      fullName,
      brandName: tractor.brand,
      modelName: tractor.model,
      category: tractor.type,
      hp: tractor.engine.powerHP,
      ptoHP: tractor.ptoHP ?? null,
      ptoRPM: tractor.ptoRPM ?? null,
      weightKg: tractor.weight ?? null,
      fuelType: tractor.engine.fuelType ?? null,
      cooling: tractor.engine.cooling ?? null,
      transmissionType: tractor.transmission?.type ?? null,
      priceMin: tractor.priceRange?.min ?? null,
      priceMax: tractor.priceRange?.max ?? null,
      usedMin: usedEstimate?.usedMin ?? null,
      usedMax: usedEstimate?.usedMax ?? null,
      suitability: {
        overallScore: suitabilityResult.overallScore,
        loaderWork: suitabilityResult.loaderScore,
        fuelEfficiency: suitabilityResult.fuelEfficiency,
        maintenance: suitabilityResult.maintenanceComplexity,
        versatility: suitabilityResult.versatilityIndex,
        costTier: suitabilityResult.costTier,
      },
    });
    map[tractor.slug] = narrative;
    done++;
    if (done % 500 === 0) console.log(`Narratives: ${done}/${total}`);
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(map, null, 0), 'utf-8');
  console.log(`Wrote ${OUT_JSON} (${Object.keys(map).length} narratives)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
