#!/usr/bin/env tsx
/**
 * Normalize all processed tractors from slug and write tractors.normalized.json + slugs.json.
 * Run from project root: npx tsx scripts/normalizeProcessedTractors.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { normalizeTractor } from '../lib/normalizeTractor';
import type { Tractor } from '../types/tractor';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUT_NORMALIZED = path.join(DATA_DIR, 'tractors.normalized.json');
const OUT_SLUGS = path.join(DATA_DIR, 'slugs.json');

async function main() {
  const { scrapedTractors } = await import('../data/processed-tractors');
  const list = (scrapedTractors as Tractor[]).filter(
    (t) => t && t.id && t.slug
  );

  const normalized = list.map((t) => normalizeTractor(t));
  const slugs = list.map((t) => {
    const n = normalizeTractor(t);
    return {
      id: t.id,
      slug: t.slug,
      brandSlug: n.normalized.brandSlug,
    };
  });

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  fs.writeFileSync(
    OUT_NORMALIZED,
    JSON.stringify(normalized, null, 0),
    'utf-8'
  );
  fs.writeFileSync(
    OUT_SLUGS,
    JSON.stringify({ slugToId: Object.fromEntries(slugs.map((s) => [s.slug, s.id])), entries: slugs }, null, 2),
    'utf-8'
  );

  console.log(`Wrote ${normalized.length} tractors to ${OUT_NORMALIZED}`);
  console.log(`Wrote ${slugs.length} slug entries to ${OUT_SLUGS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
