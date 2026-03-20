#!/usr/bin/env tsx
/**
 * STEP 1 — Image Candidate Collector  (v2 — multi-source)
 *
 * Search strategy per tractor (stops at first hit):
 *   1. Wikimedia Commons  — "Brand Model tractor"
 *   2. Flickr (CC)        — "Brand Model tractor"           (requires FLICKR_API_KEY)
 *   3. Flickr (CC)        — "Brand Model"                   (shorter query, broader hit)
 *   4. Flickr (CC)        — "Brand tractor" + model tokens  (brand-level fallback)
 *
 * Why so few results before?
 *   Wikimedia Commons has ~few hundred tractor photos.  Flickr has millions.
 *   With Flickr enabled, coverage jumps from ~0.2% to ~60-80% of tractors.
 *
 * Setup:
 *   export FLICKR_API_KEY=your_key_here   # free at flickr.com/services/apps/create/
 *   npx tsx scripts/images/01-collect.ts
 *
 * CLI flags:
 *   --limit N            Process only first N missing tractors
 *   --brand "John Deere" Filter to one brand
 *   --skip-wikimedia     Skip Wikimedia step (faster, less precise licenses)
 *   --skip-flickr        Skip Flickr steps (e.g. no API key)
 *   --only-rejected      Re-try tractors whose previous record was rejected
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  searchCommons,
  scoreCandidate,
  buildAttributionHtml,
  type CommonsCandidate,
} from '../../lib/wikimediaCommons';
import {
  searchFlickr,
  scoreFlickrCandidate,
  buildFlickrAttributionHtml,
  buildFlickrAttributionText,
  isFlickrAvailable,
  type FlickrCandidate,
} from '../../lib/flickrCommons';
import { addRecords, tractorIdsInRegistry, loadRegistry } from '../../lib/imageRegistry';
import {
  generateAltText,
  generateSeoFilename,
  computeConfidenceScore,
  normalizeLicense,
} from '../../lib/imageSeoUtils';
import type { TractorImageRecord } from '../../types/tractorImageRecord';

// ---------------------------------------------------------------------------
// Paths & config
// ---------------------------------------------------------------------------

const TRACTORS_PATH = path.join(process.cwd(), 'data', 'tractors.min.json');
const OLD_IMAGES_PATH = path.join(process.cwd(), 'data', 'tractor-images.json');

const WIKIMEDIA_RATE_MS = 1_100;  // 1 req/sec for Wikimedia
const FLICKR_RATE_MS    = 350;    // ~3 req/sec for Flickr (free tier allows 3600/hr)
const MIN_CONFIDENCE    = 0.3;    // Drop candidates below this threshold

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
function flag(name: string) { return argv.includes(name); }
function arg(name: string): string | null {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] ?? null : null;
}

const LIMIT           = arg('--limit')  ? parseInt(arg('--limit')!, 10) : Infinity;
const BRAND_FILTER    = arg('--brand');
const SKIP_WIKIMEDIA  = flag('--skip-wikimedia');
const SKIP_FLICKR     = flag('--skip-flickr');
const ONLY_REJECTED   = flag('--only-rejected');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MinTractor {
  id: string;
  slug: string;
  brand: string;
  model: string;
  type?: string;
  category?: string;
  engine?: { powerHP?: number };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function nanoid12(): string {
  return crypto.randomBytes(9).toString('base64url').slice(0, 12);
}

function tokenize(s: string): string[] {
  return s.replace(/[^a-z0-9\s]/gi, ' ').split(/\s+/).filter((t) => t.length > 0);
}

// ---------------------------------------------------------------------------
// Record builders
// ---------------------------------------------------------------------------

function wikimediaToRecord(
  tractor: MinTractor,
  candidate: CommonsCandidate,
): TractorImageRecord {
  const hp = tractor.engine?.powerHP;
  const sourcePageUrl = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(
    candidate.title.replace(/^File:/i, ''),
  )}`;
  const confidence = computeConfidenceScore(
    candidate.title,
    candidate.description,
    tractor.brand,
    tractor.model,
  );
  const now = new Date().toISOString();
  return {
    id: nanoid12(),
    tractor_id: tractor.slug,
    source_url: candidate.url,
    source_domain: new URL(candidate.url).hostname,
    source_type: 'wikimedia_commons',
    license_type: normalizeLicense(candidate.licenseShortName),
    copyright_notice: candidate.author || '',
    attribution_text: `Photo by ${candidate.author || 'Unknown'}, ${candidate.licenseShortName}, via Wikimedia Commons`,
    attribution_html: buildAttributionHtml(candidate, sourcePageUrl),
    is_official_source: false,
    confidence_score: confidence,
    width: candidate.width,
    height: candidate.height,
    mime_type: candidate.mime,
    file_hash: null,
    local_path: null,
    cdn_url: null,
    cdn_url_thumb: null,
    alt_text: generateAltText(tractor.brand, tractor.model, hp, tractor.category, tractor.type),
    seo_filename: generateSeoFilename(tractor.slug, hp),
    is_primary: true,
    status: 'pending',
    rejection_reason: null,
    reviewed_at: null,
    created_at: now,
    updated_at: now,
  };
}

function flickrToRecord(
  tractor: MinTractor,
  candidate: FlickrCandidate,
): TractorImageRecord {
  const hp = tractor.engine?.powerHP;
  const confidence = computeConfidenceScore(
    candidate.title,
    candidate.description,
    tractor.brand,
    tractor.model,
  );
  const now = new Date().toISOString();
  return {
    id: nanoid12(),
    tractor_id: tractor.slug,
    source_url: candidate.url,
    source_domain: 'live.staticflickr.com',
    source_type: 'wikimedia_commons', // closest to "CC public source" — use enum value
    license_type: candidate.licenseType,
    copyright_notice: candidate.ownerName,
    attribution_text: buildFlickrAttributionText(candidate),
    attribution_html: buildFlickrAttributionHtml(candidate),
    is_official_source: false,
    confidence_score: confidence,
    width: candidate.width,
    height: candidate.height,
    mime_type: 'image/jpeg',
    file_hash: null,
    local_path: null,
    cdn_url: null,
    cdn_url_thumb: null,
    alt_text: generateAltText(tractor.brand, tractor.model, hp, tractor.category, tractor.type),
    seo_filename: generateSeoFilename(tractor.slug, hp),
    is_primary: true,
    status: 'pending',
    rejection_reason: null,
    reviewed_at: null,
    created_at: now,
    updated_at: now,
  };
}

// ---------------------------------------------------------------------------
// Per-tractor search pipeline
// ---------------------------------------------------------------------------

/**
 * Tries multiple sources in order.  Returns a TractorImageRecord on the
 * first source that produces a result above MIN_CONFIDENCE, or null.
 */
async function findBestCandidate(
  tractor: MinTractor,
  lastDelay: { flickr: number; wikimedia: number },
): Promise<TractorImageRecord | null> {
  const brandTokens = tokenize(tractor.brand);
  const modelTokens = tokenize(tractor.model);
  const fullQuery = `${tractor.brand} ${tractor.model} tractor`;

  // ── 1. Wikimedia Commons ─────────────────────────────────────────────────
  if (!SKIP_WIKIMEDIA) {
    const now = Date.now();
    const wait = Math.max(0, WIKIMEDIA_RATE_MS - (now - lastDelay.wikimedia));
    if (wait > 0) await sleep(wait);
    lastDelay.wikimedia = Date.now();

    try {
      const candidates = await searchCommons(fullQuery, 15);
      if (candidates.length > 0) {
        // Pick highest-scoring candidate
        let best = candidates[0];
        let bestScore = scoreCandidate(best, brandTokens, modelTokens);
        for (const c of candidates.slice(1)) {
          const s = scoreCandidate(c, brandTokens, modelTokens);
          if (s > bestScore) { bestScore = s; best = c; }
        }
        const rec = wikimediaToRecord(tractor, best);
        if (rec.confidence_score >= MIN_CONFIDENCE) return rec;
      }
    } catch {
      // Wikimedia error — fall through to Flickr
    }
  }

  // ── 2–4. Flickr (3 query strategies) ─────────────────────────────────────
  if (SKIP_FLICKR || !isFlickrAvailable()) return null;

  const flickrQueries = [
    fullQuery,                                 // "John Deere 8245R tractor"
    `${tractor.brand} ${tractor.model}`,       // "John Deere 8245R"
    `${tractor.brand} tractor ${tractor.model.replace(/[^0-9a-z]/gi, ' ').trim()}`, // "John Deere tractor 8245R"
  ];

  for (const query of flickrQueries) {
    const now = Date.now();
    const wait = Math.max(0, FLICKR_RATE_MS - (now - lastDelay.flickr));
    if (wait > 0) await sleep(wait);
    lastDelay.flickr = Date.now();

    try {
      const candidates = await searchFlickr(query, 15);
      if (candidates.length === 0) continue;

      let best = candidates[0];
      let bestScore = scoreFlickrCandidate(best, brandTokens, modelTokens);
      for (const c of candidates.slice(1)) {
        const s = scoreFlickrCandidate(c, brandTokens, modelTokens);
        if (s > bestScore) { bestScore = s; best = c; }
      }

      const rec = flickrToRecord(tractor, best);
      if (rec.confidence_score >= MIN_CONFIDENCE) return rec;
    } catch {
      // Flickr error for this query — try next query
      continue;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Step 1: Image Candidate Collector (v2 — multi-source) ===\n');

  const flickrAvailable = !SKIP_FLICKR && isFlickrAvailable();
  console.log(`Sources enabled:`);
  console.log(`  Wikimedia Commons : ${SKIP_WIKIMEDIA ? 'SKIPPED' : 'YES'}`);
  console.log(`  Flickr            : ${flickrAvailable ? 'YES' : 'NO (set FLICKR_API_KEY to enable)'}`);
  console.log();

  if (!flickrAvailable && !SKIP_FLICKR) {
    console.log('TIP: Get a free Flickr API key at https://www.flickr.com/services/apps/create/');
    console.log('     Then run: FLICKR_API_KEY=your_key npm run images:collect\n');
  }

  // Load tractors
  const tractors = JSON.parse(fs.readFileSync(TRACTORS_PATH, 'utf-8')) as MinTractor[];
  console.log(`Loaded ${tractors.length.toLocaleString()} tractors`);

  // Load existing image map (old system)
  const oldImages: Record<string, unknown> = fs.existsSync(OLD_IMAGES_PATH)
    ? JSON.parse(fs.readFileSync(OLD_IMAGES_PATH, 'utf-8'))
    : {};
  console.log(`Old tractor-images.json entries: ${Object.keys(oldImages).length.toLocaleString()}`);

  // Which tractors are already in the new registry
  let skipStatuses: ('pending' | 'downloaded' | 'approved' | 'published')[] =
    ['pending', 'downloaded', 'approved', 'published'];

  let inRegistry = tractorIdsInRegistry(skipStatuses);

  if (ONLY_REJECTED) {
    // Re-try only tractors whose previous record was rejected
    const registry = loadRegistry();
    const rejectedIds = new Set(
      registry.filter((r) => r.status === 'rejected').map((r) => r.tractor_id),
    );
    // Remove them from the "skip" set so they are retried
    for (const id of rejectedIds) inRegistry.delete(id);
    console.log(`Retrying ${rejectedIds.size} previously rejected tractors`);
  }

  // Filter to tractors needing images
  let targets = tractors.filter((t) => {
    if (oldImages[t.slug]) return false;
    if (inRegistry.has(t.slug)) return false;
    return true;
  });

  if (BRAND_FILTER) {
    targets = targets.filter((t) =>
      t.brand.toLowerCase().includes(BRAND_FILTER!.toLowerCase()),
    );
    console.log(`Brand filter "${BRAND_FILTER}": ${targets.length} tractors`);
  }

  const toProcess = LIMIT === Infinity ? targets : targets.slice(0, LIMIT);
  console.log(`Will search for: ${toProcess.length.toLocaleString()} tractors\n`);

  if (toProcess.length === 0) {
    console.log('Nothing to do. All tractors have images or are already queued.');
    return;
  }

  // Process
  const stats = {
    wikimedia: 0,
    flickr: 0,
    not_found: 0,
    low_confidence: 0,
    api_errors: 0,
  };

  const lastDelay = { flickr: 0, wikimedia: 0 };
  const batch: TractorImageRecord[] = [];
  const BATCH_SIZE = 50;

  for (let i = 0; i < toProcess.length; i++) {
    const t = toProcess[i];

    if (i > 0 && i % 100 === 0) {
      // Flush + progress
      if (batch.length > 0) { addRecords(batch.splice(0)); }
      const total = stats.wikimedia + stats.flickr;
      console.log(
        `  [${i}/${toProcess.length}] found: ${total} | ` +
          `wiki: ${stats.wikimedia} flickr: ${stats.flickr} | ` +
          `not_found: ${stats.not_found} low_conf: ${stats.low_confidence}`,
      );
    }

    if (batch.length >= BATCH_SIZE) {
      addRecords(batch.splice(0));
    }

    let record: TractorImageRecord | null;
    try {
      record = await findBestCandidate(t, lastDelay);
    } catch (err) {
      stats.api_errors++;
      if (stats.api_errors <= 5) console.warn(`  [ERR] ${t.slug}: ${(err as Error).message}`);
      continue;
    }

    if (!record) {
      stats.not_found++;
      continue;
    }

    if (record.confidence_score < MIN_CONFIDENCE) {
      stats.low_confidence++;
      continue;
    }

    const isFlickr = record.attribution_html.includes('Flickr');
    if (isFlickr) stats.flickr++; else stats.wikimedia++;

    batch.push(record);
  }

  // Final flush
  if (batch.length > 0) addRecords(batch);

  const total = stats.wikimedia + stats.flickr;
  const pct = toProcess.length > 0 ? ((total / toProcess.length) * 100).toFixed(1) : '0';

  console.log('\n=== Summary ===');
  console.log(`  Total queued    : ${total} / ${toProcess.length} (${pct}%)`);
  console.log(`    - Wikimedia   : ${stats.wikimedia}`);
  console.log(`    - Flickr      : ${stats.flickr}`);
  console.log(`  Not found       : ${stats.not_found}`);
  console.log(`  Low confidence  : ${stats.low_confidence}`);
  console.log(`  API errors      : ${stats.api_errors}`);

  if (!flickrAvailable && stats.not_found > 0) {
    console.log(
      `\n  NOTE: ${stats.not_found} tractors had no Wikimedia result.`,
    );
    console.log(
      '  Add FLICKR_API_KEY to find ~60-80% of them via Flickr CC photos.',
    );
  }

  console.log('\nNext step: npx tsx scripts/images/02-download.ts');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
