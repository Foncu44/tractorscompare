#!/usr/bin/env tsx
/**
 * Remove tractors whose production ended before the given year.
 * Usage: npm run prune-old-tractors -- --before-year 1990
 *
 * Keeps tractors that have:
 * - year >= beforeYear, or
 * - productionYears.end >= beforeYear, or
 * - productionYears.start >= beforeYear (when end is missing), or
 * - no year/productionYears (kept to avoid pruning on missing data).
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Tractor } from '../types/tractor';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROCESSED_PATH = path.join(DATA_DIR, 'processed-tractors.ts');

function getLatestYear(t: Tractor): number | null {
  if (t.productionYears?.end != null) return t.productionYears.end;
  if (t.productionYears?.start != null) return t.productionYears.start;
  if (t.year != null) return t.year;
  return null;
}

function isBeforeYear(t: Tractor, beforeYear: number): boolean {
  const latest = getLatestYear(t);
  if (latest === null) return false; // no year info -> keep
  return latest < beforeYear;
}

async function main() {
  const args = process.argv.slice(2);
  const beforeYearIdx = args.indexOf('--before-year');
  const beforeYear =
    beforeYearIdx >= 0 && args[beforeYearIdx + 1]
      ? parseInt(args[beforeYearIdx + 1], 10)
      : NaN;

  if (!Number.isInteger(beforeYear) || beforeYear < 1900 || beforeYear > 2100) {
    console.error('Usage: npm run prune-old-tractors -- --before-year <year>');
    console.error('Example: npm run prune-old-tractors -- --before-year 1990');
    process.exit(1);
  }

  const { scrapedTractors } = await import('../data/processed-tractors');
  const list = scrapedTractors as Tractor[];
  const before = list.length;
  const kept = list.filter((t) => !isBeforeYear(t, beforeYear));
  const removed = before - kept.length;

  const header = `import { Tractor } from '@/types/tractor';

// Tractores extraídos desde TractorData.com
// Pruned: removed tractors with latest year before ${beforeYear}. Run: npm run prune-old-tractors -- --before-year ${beforeYear}
// @ts-ignore - Array muy grande que causa error de complejidad de tipo en TypeScript
export const scrapedTractors: Tractor[] = `;

  const content = header + JSON.stringify(kept, null, 2) + ';\n';
  fs.writeFileSync(PROCESSED_PATH, content, 'utf-8');

  console.log(`Pruned tractors with latest year before ${beforeYear}`);
  console.log(`  Before: ${before}`);
  console.log(`  Removed: ${removed}`);
  console.log(`  Kept: ${kept.length}`);
  console.log(`  Wrote ${PROCESSED_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
