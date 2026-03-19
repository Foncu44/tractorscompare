#!/usr/bin/env tsx
/**
 * Precompute deterministic tractor narratives AND intro texts for all tractors.
 * Writes two files:
 *   data/narratives.json   — TractorNarrative objects keyed by slug
 *   data/intros.json       — {en, es} intro paragraph strings keyed by slug
 *
 * Run before build: `npm run build:narratives`
 * The tractor detail page uses these pre-built strings at render time,
 * avoiding per-request computation across 10,000+ tractors.
 *
 * Falls back to runtime generation for any slug not present in these files.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TractorNarrative } from '../lib/tractorNarrative';
import { buildTractorNarrative } from '../lib/tractorNarrative';
import { buildIntroText } from '../lib/tractorIntro';
import { estimateUsedPrice } from '../lib/usedPriceEstimate';
import { specsFromTractor, computeSuitability } from '../lib/tractorSuitability';
import type { Tractor } from '../types/tractor';

const DATA_DIR = path.join(process.cwd(), 'data');
const NARRATIVES_OUT = path.join(DATA_DIR, 'narratives.json');
const INTROS_OUT = path.join(DATA_DIR, 'intros.json');

const BATCH_LOG = 500; // log progress every N tractors

interface IntroEntry {
  en: string;
  es: string;
}

async function main() {
  const { tractors } = await import('../data/tractors');
  const list = tractors as Tractor[];
  const total = list.length;

  const narrativeMap: Record<string, TractorNarrative> = {};
  const introMap: Record<string, IntroEntry> = {};

  let done = 0;
  const t0 = Date.now();

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

    const narrativeInput = {
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
    };

    // Build English narrative (only English is cached — ES is built at runtime)
    narrativeMap[tractor.slug] = buildTractorNarrative(narrativeInput, 'en');

    // Build intro texts for both locales
    introMap[tractor.slug] = {
      en: buildIntroText(tractor, 'en'),
      es: buildIntroText(tractor, 'es'),
    };

    done++;
    if (done % BATCH_LOG === 0) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const rate = (done / parseFloat(elapsed)).toFixed(0);
      console.log(`[${done}/${total}] ${rate} tractors/s — ${elapsed}s elapsed`);
    }
  }

  // Write output files (minified JSON for smaller bundle)
  fs.writeFileSync(NARRATIVES_OUT, JSON.stringify(narrativeMap), 'utf-8');
  fs.writeFileSync(INTROS_OUT, JSON.stringify(introMap), 'utf-8');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✓ Wrote ${NARRATIVES_OUT} (${Object.keys(narrativeMap).length} narratives)`);
  console.log(`✓ Wrote ${INTROS_OUT} (${Object.keys(introMap).length} intros)`);
  console.log(`  Total time: ${elapsed}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
