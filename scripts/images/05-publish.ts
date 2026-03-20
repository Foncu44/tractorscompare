#!/usr/bin/env tsx
/**
 * STEP 5 — Publisher
 *
 * Merges all `approved` records into the existing data/tractor-images.json,
 * which is what lib/tractorImages.ts reads at build time.
 *
 * For each approved record:
 *  - Builds a TractorImage-compatible entry with cdn_url as the image URL
 *    (served from /public/images/tractors/).
 *  - Marks the registry record as "published".
 *  - Writes the merged map back to data/tractor-images.json.
 *
 * Usage:
 *   npx tsx scripts/images/05-publish.ts
 *   npx tsx scripts/images/05-publish.ts --dry-run   (preview without writing)
 *
 * After running:
 *   git add data/tractor-images.json public/images/tractors/
 *   git commit -m "feat: publish N new tractor images"
 */

import fs from 'fs';
import path from 'path';
import { findByStatus, updateRecord, registryStats } from '../../lib/imageRegistry';
import type { TractorImageRecord } from '../../types/tractorImageRecord';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const IMAGES_MAP_PATH = path.join(process.cwd(), 'data', 'tractor-images.json');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const DRY_RUN = process.argv.includes('--dry-run');
const AUTO_ACCEPT_CONFIDENCE = (() => {
  const idx = process.argv.indexOf('--auto-accept-confidence');
  return idx !== -1 ? parseFloat(process.argv[idx + 1]) || 0 : 0;
})();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a registry record to the TractorImage schema read by
 * lib/tractorImages.ts at build time.
 *
 * We preserve backwards-compatibility: the `url` field holds the CDN path
 * (local WebP), and `source` is set to 'wikimedia' for CC-licensed images.
 */
function recordToTractorImage(r: TractorImageRecord): Record<string, unknown> {
  return {
    url: r.cdn_url!,
    thumbUrl: r.cdn_url_thumb ?? undefined,
    source: r.source_type === 'wikimedia_commons' ? 'wikimedia' : r.source_type,
    sourcePageUrl: r.source_url,
    author: r.copyright_notice || 'Unknown',
    license: r.license_type,
    licenseUrl:
      r.license_type === 'CC-BY-SA'
        ? 'https://creativecommons.org/licenses/by-sa/4.0/'
        : r.license_type === 'CC-BY'
        ? 'https://creativecommons.org/licenses/by/4.0/'
        : r.license_type === 'CC0'
        ? 'https://creativecommons.org/publicdomain/zero/1.0/'
        : r.source_url,
    attributionHtml: r.attribution_html,
    attributionText: r.attribution_text,
    altText: r.alt_text,
    width: r.width,
    height: r.height,
    matchConfidence: confidenceToLabel(r.confidence_score),
  };
}

function confidenceToLabel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Step 5: Publisher ===\n');
  if (DRY_RUN) console.log('[DRY RUN — no files will be written]\n');

  const stats = registryStats();
  console.log('Registry state:');
  for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(12)}: ${v}`);
  console.log();

  // Find approved records
  let approved = findByStatus('approved');

  // Optionally auto-accept high-confidence records that haven't been reviewed
  if (AUTO_ACCEPT_CONFIDENCE > 0) {
    const autoCount = approved.filter((r) => r.confidence_score >= AUTO_ACCEPT_CONFIDENCE).length;
    console.log(
      `Auto-accepting ${autoCount} records with confidence ≥ ${AUTO_ACCEPT_CONFIDENCE}`,
    );
  }

  if (approved.length === 0) {
    console.log('No approved records to publish. Review images with 04-review.ts first.');
    return;
  }

  console.log(`Publishing ${approved.length} approved images...\n`);

  // Load existing image map
  let imageMap: Record<string, unknown> = {};
  if (fs.existsSync(IMAGES_MAP_PATH)) {
    imageMap = JSON.parse(fs.readFileSync(IMAGES_MAP_PATH, 'utf-8'));
  }

  let published = 0;
  let skippedNoCdn = 0;

  for (const record of approved) {
    if (!record.cdn_url) {
      console.warn(`  [SKIP] ${record.tractor_id}: cdn_url not set — run 03-optimize.ts first`);
      skippedNoCdn++;
      continue;
    }

    const entry = recordToTractorImage(record);
    imageMap[record.tractor_id] = entry;

    if (!DRY_RUN) {
      updateRecord(record.id, {
        status: 'published',
        reviewed_at: record.reviewed_at ?? new Date().toISOString(),
      });
    }

    published++;
    if (published <= 5 || published % 500 === 0) {
      console.log(`  [OK] ${record.tractor_id} → ${record.cdn_url}`);
    }
  }

  // Write merged map
  if (!DRY_RUN) {
    const tmp = IMAGES_MAP_PATH + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(imageMap, null, 2), 'utf-8');
    fs.renameSync(tmp, IMAGES_MAP_PATH);
    console.log(`\nWrote ${Object.keys(imageMap).length.toLocaleString()} entries to data/tractor-images.json`);
  } else {
    console.log(`\n[DRY RUN] Would write ${Object.keys(imageMap).length.toLocaleString()} entries`);
  }

  console.log('\n=== Summary ===');
  console.log(`  Published   : ${published}`);
  console.log(`  Skipped (no CDN): ${skippedNoCdn}`);
  console.log('\nDone! Rebuild the site to pick up the new images:');
  console.log('  npm run build');
  console.log('\nDon\'t forget to commit:');
  console.log('  git add data/tractor-images.json public/images/tractors/');
  console.log('  git commit -m "feat: publish ' + published + ' new tractor images"');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
