#!/usr/bin/env tsx
/**
 * STEP 2 — Image Downloader + Validator
 *
 * For every `pending` record in the registry:
 *  1. Downloads the source image.
 *  2. Validates dimensions and file size.
 *  3. Computes SHA-256 hash; rejects duplicates.
 *  4. Saves raw file to public/images/tractors/_raw/ (original, pre-optimise).
 *  5. Transitions status:
 *       pending → downloaded   (passed all checks)
 *       pending → rejected     (failed a validation rule)
 *
 * Usage:
 *   npx tsx scripts/images/02-download.ts
 *   npx tsx scripts/images/02-download.ts --concurrency 3
 *
 * Downloads are sequential by default (1 at a time) to respect source
 * servers.  Use --concurrency N to parallelise (max recommended: 3).
 */

import fs from 'fs';
import path from 'path';
import {
  fetchImageBuffer,
  validateImageBuffer,
  hashBuffer,
  saveImageFile,
  ensureImageDir,
  IMAGES_PUBLIC_DIR,
} from '../../lib/imageOptimizer';
import {
  loadRegistry,
  updateRecord,
  findByHash,
  findByStatus,
} from '../../lib/imageRegistry';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Directory to store raw (un-optimised) originals. */
const RAW_DIR = path.join(IMAGES_PUBLIC_DIR, '_raw');

const args = process.argv.slice(2);
const concArg = args.findIndex((a) => a === '--concurrency');
const CONCURRENCY = concArg !== -1 ? Math.min(parseInt(args[concArg + 1], 10) || 1, 5) : 1;

// Delay between downloads (per slot) to be a polite crawler
const DOWNLOAD_DELAY_MS = 800;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function ensureRawDir(): void {
  if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
}

/** Returns the raw file path for a given registry record ID. */
function rawFilePath(id: string): string {
  return path.join(RAW_DIR, `${id}.orig`);
}

async function processRecord(id: string): Promise<'downloaded' | 'rejected' | 'skipped'> {
  const registry = loadRegistry();
  const record = registry.find((r) => r.id === id);
  if (!record || record.status !== 'pending') return 'skipped';

  // --- Download ---
  let buf: Buffer;
  try {
    buf = await fetchImageBuffer(record.source_url);
  } catch (err) {
    updateRecord(id, {
      status: 'rejected',
      rejection_reason: `download_failed: ${(err as Error).message}`,
      reviewed_at: new Date().toISOString(),
    });
    return 'rejected';
  }

  // --- Validate ---
  const validation = await validateImageBuffer(buf);
  if (!validation.ok) {
    updateRecord(id, {
      status: 'rejected',
      rejection_reason: validation.reason ?? 'validation_failed',
      reviewed_at: new Date().toISOString(),
    });
    return 'rejected';
  }

  // --- Deduplicate ---
  const hash = hashBuffer(buf);
  const existing = findByHash(hash);
  if (existing && existing.id !== id) {
    updateRecord(id, {
      status: 'rejected',
      rejection_reason: `duplicate_of:${existing.id}`,
      reviewed_at: new Date().toISOString(),
    });
    return 'rejected';
  }

  // --- Persist raw file ---
  ensureRawDir();
  fs.writeFileSync(rawFilePath(id), buf);

  // --- Update record ---
  updateRecord(id, {
    status: 'downloaded',
    file_hash: hash,
    width: validation.width!,
    height: validation.height!,
    mime_type: validation.mime!,
  });

  return 'downloaded';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Step 2: Image Downloader ===\n');

  ensureImageDir();
  ensureRawDir();

  const pending = findByStatus('pending');
  console.log(`Pending records: ${pending.length}`);

  if (pending.length === 0) {
    console.log('No pending records. Run 01-collect.ts first.');
    return;
  }

  const ids = pending.map((r) => r.id);
  const stats = { downloaded: 0, rejected: 0, skipped: 0, errors: 0 };

  if (CONCURRENCY === 1) {
    // Sequential
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (i > 0 && i % 50 === 0) {
        console.log(
          `  Progress: ${i}/${ids.length} | ok: ${stats.downloaded} | rejected: ${stats.rejected}`,
        );
      }
      try {
        const result = await processRecord(id);
        stats[result]++;
      } catch (err) {
        stats.errors++;
        console.warn(`  [ERROR] ${id}: ${(err as Error).message}`);
      }
      await sleep(DOWNLOAD_DELAY_MS);
    }
  } else {
    // Parallel with limited concurrency
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += CONCURRENCY) {
      chunks.push(ids.slice(i, i + CONCURRENCY));
    }
    for (let ci = 0; ci < chunks.length; ci++) {
      if (ci > 0 && ci % 10 === 0) {
        const processed = ci * CONCURRENCY;
        console.log(
          `  Progress: ${processed}/${ids.length} | ok: ${stats.downloaded} | rejected: ${stats.rejected}`,
        );
      }
      const results = await Promise.allSettled(chunks[ci].map((id) => processRecord(id)));
      for (const r of results) {
        if (r.status === 'fulfilled') stats[r.value]++;
        else stats.errors++;
      }
      await sleep(DOWNLOAD_DELAY_MS);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`  Downloaded  : ${stats.downloaded}`);
  console.log(`  Rejected    : ${stats.rejected}  (duplicates, too small, etc.)`);
  console.log(`  Errors      : ${stats.errors}`);
  console.log(`  Skipped     : ${stats.skipped}`);
  console.log(`\n  Raw files saved to: ${RAW_DIR}`);
  console.log('\nNext step: npx tsx scripts/images/03-optimize.ts');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
