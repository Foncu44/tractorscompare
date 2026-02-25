#!/usr/bin/env tsx
/**
 * Fetch free-to-use tractor images from Wikimedia Commons.
 * Outputs: data/image-cache.json, data/tractor-images.json, data/processed-tractors-with-images.ts, report.
 * Rate limit: 1 request/sec. Run from project root: npx tsx scripts/fetchTractorImages.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import type { TractorImage } from '../types/tractor';
import {
  searchCommons,
  scoreCandidate,
  buildAttributionHtml,
  type CommonsCandidate,
} from '../lib/wikimediaCommons';

const DATA_DIR = path.join(process.cwd(), 'data');
const CACHE_PATH = path.join(DATA_DIR, 'image-cache.json');
const IMAGES_OUT_PATH = path.join(DATA_DIR, 'tractor-images.json');
const REPORT_PATH = path.join(DATA_DIR, 'image-fetch-report.json');
const COMMONS_FILE_URL = (title: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replace(/^File:/i, ''))}`;

const RATE_MS = 1000;

type ImageCache = Record<string, { image: TractorImage; query: string }>;
type TractorImagesMap = Record<string, TractorImage>;

function loadCache(): ImageCache {
  try {
    const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
    return JSON.parse(raw) as ImageCache;
  } catch {
    return {};
  }
}

function saveCache(cache: ImageCache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), 'utf-8');
}

function tokenize(s: string): string[] {
  return s
    .replace(/[^a-z0-9\s-]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/** Mirror data/tractors normalizer so slug matches app. */
function normalizedSlug(brand: string, model: string): string {
  let b = brand.trim();
  let m = model.trim();
  if (b === 'John' && m.startsWith('Deere ')) {
    b = 'John Deere';
    m = m.replace(/^Deere\s+/, '');
  } else if (b === 'New' && m.startsWith('Holland ')) {
    b = 'New Holland';
    m = m.replace(/^Holland\s+/, '');
  } else if (b === 'Massey' && m.startsWith('Ferguson ')) {
    b = 'Massey Ferguson';
    m = m.replace(/^Ferguson\s+/, '');
  }
  if (['CaseIH', 'Case IH', 'Case', 'J.I. Case', 'J.I Case'].includes(b)) b = 'Case IH';
  const bSlug = b.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const mSlug = m.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${bSlug}-${mSlug}`;
}

function matchConfidence(
  title: string,
  description: string | undefined,
  brand: string,
  model: string
): 'high' | 'medium' | 'low' {
  const text = `${(title || '')} ${(description || '')}`.toLowerCase();
  const brandTokens = tokenize(brand);
  const modelTokens = tokenize(model);
  const hasBrand = brandTokens.some((t) => t.length >= 2 && text.includes(t.toLowerCase()));
  const hasModel = modelTokens.some((t) => t.length >= 1 && text.includes(t.toLowerCase()));
  if (hasBrand && hasModel) return 'high';
  if (hasBrand) return 'medium';
  return 'low';
}

function candidateToTractorImage(
  c: CommonsCandidate,
  brand: string,
  model: string
): TractorImage {
  const sourcePageUrl = COMMONS_FILE_URL(c.title);
  const confidence = matchConfidence(c.title, c.description, brand, model);
  return {
    url: c.url,
    source: 'wikimedia',
    sourcePageUrl,
    author: c.author || 'Unknown',
    license: c.licenseShortName || 'See source',
    licenseUrl: c.licenseUrl || sourcePageUrl,
    attributionHtml: buildAttributionHtml(c, sourcePageUrl),
    matchConfidence: confidence,
  };
}

function pickBestCandidate(
  candidates: CommonsCandidate[],
  brand: string,
  model: string
): CommonsCandidate | null {
  if (candidates.length === 0) return null;
  const brandTokens = tokenize(brand);
  const modelTokens = tokenize(model);
  let best = candidates[0];
  let bestScore = scoreCandidate(best, brandTokens, modelTokens);
  for (let i = 1; i < candidates.length; i++) {
    const s = scoreCandidate(candidates[i], brandTokens, modelTokens);
    if (s > bestScore) {
      bestScore = s;
      best = candidates[i];
    }
  }
  return best;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { scrapedTractors } = await import('../data/processed-tractors');
  const tractors = scrapedTractors as Array<{ slug: string; brand: string; model: string }>;

  const cache = loadCache();
  const imageMap: TractorImagesMap = {};
  const report = {
    total: tractors.length,
    matched: 0,
    byConfidence: { high: 0, medium: 0, low: 0 },
    unmatched: 0,
    failureReasons: {} as Record<string, number>,
    cachedHits: 0,
    apiCalls: 0,
  };

  for (let i = 0; i < tractors.length; i++) {
    const t = tractors[i];
    const brand = (t.brand || '').trim();
    const model = (t.model || '').trim();
    const query = `${brand} ${model} tractor`.trim() || 'tractor';
    const cacheKey = query.toLowerCase().replace(/\s+/g, ' ');

    if (i > 0 && i % 500 === 0) {
      console.log(`Progress: ${i}/${tractors.length} (matched: ${report.matched})`);
      saveCache(cache);
      fs.writeFileSync(IMAGES_OUT_PATH, JSON.stringify(imageMap, null, 0), 'utf-8');
    }

    const slug = normalizedSlug(brand, model);

    if (cache[cacheKey]) {
      imageMap[slug] = cache[cacheKey].image;
      report.matched++;
      const c = cache[cacheKey].image.matchConfidence;
      if (c === 'high') report.byConfidence.high++;
      else if (c === 'medium') report.byConfidence.medium++;
      else report.byConfidence.low++;
      report.cachedHits++;
      continue;
    }

    let candidates: CommonsCandidate[];
    try {
      await sleep(RATE_MS);
      candidates = await searchCommons(query, 15);
      report.apiCalls++;
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'fetch_error';
      report.failureReasons[reason] = (report.failureReasons[reason] || 0) + 1;
      report.unmatched++;
      continue;
    }

    const chosen = pickBestCandidate(candidates, brand, model);
    if (!chosen) {
      report.unmatched++;
      report.failureReasons['no_allowed_license'] = (report.failureReasons['no_allowed_license'] || 0) + 1;
      continue;
    }

    const image = candidateToTractorImage(chosen, brand, model);
    cache[cacheKey] = { image, query };
    imageMap[slug] = image;
    report.matched++;
    const conf = image.matchConfidence;
    if (conf === 'high') report.byConfidence.high++;
    else if (conf === 'medium') report.byConfidence.medium++;
    else report.byConfidence.low++;
  }

  saveCache(cache);
  fs.writeFileSync(IMAGES_OUT_PATH, JSON.stringify(imageMap, null, 0), 'utf-8');
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  const outTs = `/**
 * Tractors with optional Wikimedia Commons images (generated by scripts/fetchTractorImages.ts).
 * Merges processed-tractors with data/tractor-images.json. Do not edit by hand.
 */
import { scrapedTractors } from './processed-tractors';
import tractorImages from './tractor-images.json';

const images = tractorImages as Record<string, import('@/types/tractor').TractorImage>;

export const scrapedTractorsWithImages = scrapedTractors.map((t) => ({
  ...t,
  image: images[t.slug] ?? undefined,
  imageUrl: images[t.slug]?.url ?? t.imageUrl,
}));
`;

  fs.writeFileSync(path.join(DATA_DIR, 'processed-tractors-with-images.ts'), outTs, 'utf-8');

  console.log('Summary:');
  console.log('  Total:', report.total);
  console.log('  Matched:', report.matched, '(high:', report.byConfidence.high, 'medium:', report.byConfidence.medium, 'low:', report.byConfidence.low, ')');
  console.log('  Unmatched:', report.unmatched);
  console.log('  Cached hits:', report.cachedHits);
  console.log('  API calls:', report.apiCalls);
  console.log('  Top failure reasons:', Object.entries(report.failureReasons).sort((a, b) => b[1] - a[1]).slice(0, 5));
  console.log('Wrote:', CACHE_PATH, IMAGES_OUT_PATH, REPORT_PATH, path.join(DATA_DIR, 'processed-tractors-with-images.ts'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
