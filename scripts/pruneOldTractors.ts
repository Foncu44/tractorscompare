#!/usr/bin/env tsx
/**
 * Remove tractors whose production ended before the given year.
 * Usage: npm run prune-old-tractors -- --before-year 1990
 *
 * Keeps tractors that have:
 * - productionYears.end >= beforeYear (when end is known),
 * - productionYears.start only (no end) -> KEPT (we don't know end, assume may still be in production),
 * - year >= beforeYear (single year),
 * - no year/productionYears (kept to avoid pruning on missing data).
 *
 * A tractor produced from 1995 onwards with no end year is retained when pruning before 2010.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Tractor } from '../types/tractor';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROCESSED_PATH = path.join(DATA_DIR, 'processed-tractors.ts');

/**
 * Returns the latest known production year used for pruning.
 * When only start is available, returns null so we do NOT prune (tractor may still be in production).
 */
function getEndYearForPruning(t: Tractor): number | null {
  if (t.productionYears?.end != null) return t.productionYears.end;
  if (t.year != null) return t.year;
  return null;
}

/**
 * True if the tractor should be pruned (removed): we know production ended before beforeYear.
 * When only productionYears.start exists (no end), we keep the tractor.
 */
function isBeforeYear(t: Tractor, beforeYear: number): boolean {
  const endYear = getEndYearForPruning(t);
  if (endYear === null) return false; // no known end -> keep
  return endYear < beforeYear;
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
