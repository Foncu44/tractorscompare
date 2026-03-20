#!/usr/bin/env tsx
/**
 * STEP 3 — Image Optimiser
 *
 * For every `downloaded` record in the registry:
 *  1. Reads the raw file from public/images/tractors/_raw/{id}.orig
 *  2. Converts to WebP at ≤1200 px wide, quality 85.
 *  3. Generates a 400-px-wide thumbnail WebP.
 *  4. Saves both under the SEO-descriptive filename.
 *  5. Updates the record with local_path, cdn_url, cdn_url_thumb, width, height.
 *  6. Transitions status: downloaded → approved
 *     (images go straight to "approved" so they can be reviewed in step 4
 *      or published directly if you trust the Wikimedia source).
 *
 * Usage:
 *   npx tsx scripts/images/03-optimize.ts
 *
 * Requires: npm install sharp
 */

import fs from 'fs';
import path from 'path';
import {
  optimiseImage,
  saveImageFile,
  toCdnUrl,
  toLocalPath,
  toThumbFilename,
  IMAGES_PUBLIC_DIR,
} from '../../lib/imageOptimizer';
import { findByStatus, updateRecord } from '../../lib/imageRegistry';

const RAW_DIR = path.join(IMAGES_PUBLIC_DIR, '_raw');

function rawFilePath(id: string): string {
  return path.join(RAW_DIR, `${id}.orig`);
}

async function processRecord(id: string, seoFilename: string): Promise<'optimised' | 'error'> {
  const rawPath = rawFilePath(id);
  if (!fs.existsSync(rawPath)) {
    updateRecord(id, {
      status: 'rejected',
      rejection_reason: 'raw_file_missing',
      reviewed_at: new Date().toISOString(),
    });
    return 'error';
  }

  const buf = fs.readFileSync(rawPath);

  let result: Awaited<ReturnType<typeof optimiseImage>>;
  try {
    result = await optimiseImage(buf, 1200);
  } catch (err) {
    updateRecord(id, {
      status: 'rejected',
      rejection_reason: `optimise_failed: ${(err as Error).message}`,
      reviewed_at: new Date().toISOString(),
    });
    return 'error';
  }

  const thumbFilename = toThumbFilename(seoFilename);

  saveImageFile(seoFilename, result.webpBuffer);
  saveImageFile(thumbFilename, result.thumbBuffer);

  updateRecord(id, {
    status: 'approved',
    local_path: toLocalPath(seoFilename),
    cdn_url: toCdnUrl(seoFilename),
    cdn_url_thumb: toCdnUrl(thumbFilename),
    width: result.width,
    height: result.height,
    mime_type: 'image/webp',
  });

  return 'optimised';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Step 3: Image Optimiser ===\n');

  const downloaded = findByStatus('downloaded');
  console.log(`Downloaded records to optimise: ${downloaded.length}`);

  if (downloaded.length === 0) {
    console.log('No downloaded records. Run 02-download.ts first.');
    return;
  }

  const stats = { optimised: 0, errors: 0 };

  for (let i = 0; i < downloaded.length; i++) {
    const record = downloaded[i];

    if (i > 0 && i % 100 === 0) {
      console.log(
        `  Progress: ${i}/${downloaded.length} | ok: ${stats.optimised} | errors: ${stats.errors}`,
      );
    }

    const result = await processRecord(record.id, record.seo_filename);
    stats[result === 'optimised' ? 'optimised' : 'errors']++;
  }

  console.log('\n=== Summary ===');
  console.log(`  Optimised   : ${stats.optimised}`);
  console.log(`  Errors      : ${stats.errors}`);
  console.log(`\n  WebP files saved to: ${IMAGES_PUBLIC_DIR}`);
  console.log('\nNext step: npx tsx scripts/images/04-review.ts');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
