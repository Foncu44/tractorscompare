#!/usr/bin/env tsx
/**
 * TractorFit™ build pipeline step 1: normalize and output minimal dataset + slugs.
 * Run from project root: tsx scripts/buildDataset.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TractorMin, SlugsFile } from '../lib/tractorFit/types';
import type { Tractor } from '../types/tractor';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUT_MIN = path.join(DATA_DIR, 'tractors.min.json');
const OUT_SLUGS = path.join(DATA_DIR, 'slugs.json');

function normalizeUnits(t: Tractor): Tractor {
  const out = { ...t };
  if (out.weight != null && out.weight < 100) out.weight = out.weight * 1000;
  if (out.hydraulicSystem?.pumpFlow != null && out.hydraulicSystem.pumpFlow > 500)
    out.hydraulicSystem = { ...out.hydraulicSystem, pumpFlow: out.hydraulicSystem.pumpFlow / 10 };
  return out;
}

function toTractorMin(t: Tractor): TractorMin {
  const n = normalizeUnits(t);
  return {
    id: n.id,
    slug: n.slug,
    brand: n.brand,
    model: n.model,
    type: n.type || 'farm',
    category: n.category,
    engine: {
      powerHP: n.engine?.powerHP ?? 0,
      fuelType: n.engine?.fuelType,
      displacement: n.engine?.displacement,
      cylinders: n.engine?.cylinders,
    },
    transmission: {
      type: n.transmission?.type ?? 'manual',
      gears: n.transmission?.gears,
    },
    weight: n.weight,
    hydraulicSystem: n.hydraulicSystem
      ? {
          pumpFlow: n.hydraulicSystem.pumpFlow,
          liftCapacity: n.hydraulicSystem.liftCapacity,
          frontLiftCapacity: n.hydraulicSystem.frontLiftCapacity,
          rearValves: n.hydraulicSystem.rearValves,
          valves: n.hydraulicSystem.valves,
        }
      : undefined,
    ptoHP: n.ptoHP,
    ptoRPM: n.ptoRPM,
    ptoRearSpeeds: n.ptoRearSpeeds,
    ptoFront: n.ptoFront,
    ptoFrontPower: n.ptoFrontPower,
    priceRange: n.priceRange,
    imageUrl: n.imageUrl,
  };
}

async function main() {
  const { tractors } = await import('../data/tractors');
  const list = (tractors as Tractor[]).filter(
    (t) => t?.id && t?.slug && t?.engine?.powerHP != null && t?.transmission?.type
  );

  const minList: TractorMin[] = list.map(toTractorMin);
  const slugToId: Record<string, string> = {};
  const entries: { id: string; slug: string }[] = [];
  for (const m of minList) {
    slugToId[m.slug] = m.id;
    entries.push({ id: m.id, slug: m.slug });
  }

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  fs.writeFileSync(OUT_MIN, JSON.stringify(minList, null, 0), 'utf-8');
  fs.writeFileSync(
    OUT_SLUGS,
    JSON.stringify({ slugToId, entries } as SlugsFile, null, 2),
    'utf-8'
  );

  console.log(`Wrote ${minList.length} tractors to ${OUT_MIN}`);
  console.log(`Wrote ${entries.length} slug entries to ${OUT_SLUGS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
