/**
 * Flickr API client for finding CC-licensed tractor images.
 *
 * Why Flickr?
 *  Flickr has 15+ billion photos.  Tractor enthusiasts upload thousands of
 *  model-specific photos under CC licenses.  Wikimedia Commons only has a
 *  few hundred, which is why the Wikimedia-only collector returned 13/6142.
 *
 * License policy (commercial-safe only):
 *  4  → CC BY 2.0
 *  5  → CC BY-SA 2.0
 *  7  → No known copyright (Flickr Commons)
 *  8  → US Government work (public domain)
 *  9  → CC0 (public domain dedication)
 *  10 → Public Domain Mark
 *
 * Requires env var: FLICKR_API_KEY
 * Get one free at: https://www.flickr.com/services/apps/create/
 */

import type { LicenseType } from '@/types/tractorImageRecord';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FLICKR_API = 'https://www.flickr.com/services/rest/';

/** Flickr license IDs that allow commercial use (no NC, no ND for our case). */
const COMMERCIAL_SAFE_LICENSES = '4,5,7,8,9,10';

/** Minimum large-image width we require from Flickr results. */
const MIN_WIDTH = 600;

// ---------------------------------------------------------------------------
// License metadata
// ---------------------------------------------------------------------------

interface FlickrLicenseMeta {
  shortName: string;
  licenseType: LicenseType;
  url: string;
}

const LICENSE_MAP: Record<string, FlickrLicenseMeta> = {
  '4':  { shortName: 'CC BY 2.0',  licenseType: 'CC-BY',    url: 'https://creativecommons.org/licenses/by/2.0/' },
  '5':  { shortName: 'CC BY-SA 2.0', licenseType: 'CC-BY-SA', url: 'https://creativecommons.org/licenses/by-sa/2.0/' },
  '7':  { shortName: 'No known copyright', licenseType: 'PD', url: 'https://www.flickr.com/commons/usage/' },
  '8':  { shortName: 'US Government work', licenseType: 'PD', url: 'https://www.usa.gov/copyright.shtml' },
  '9':  { shortName: 'CC0 1.0',    licenseType: 'CC0',       url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  '10': { shortName: 'Public Domain Mark', licenseType: 'PD', url: 'https://creativecommons.org/publicdomain/mark/1.0/' },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlickrCandidate {
  id: string;
  owner: string;
  ownerName: string;
  title: string;
  description: string;
  url: string;          // large image URL (≥ 1024 px)
  thumbUrl: string;     // small square thumbnail URL
  width: number;
  height: number;
  licenseId: string;
  licenseShortName: string;
  licenseType: LicenseType;
  licenseUrl: string;
  sourcePageUrl: string;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

function getApiKey(): string {
  const key = process.env.FLICKR_API_KEY;
  if (!key) {
    throw new Error(
      'FLICKR_API_KEY environment variable is not set.\n' +
        'Get a free key at: https://www.flickr.com/services/apps/create/',
    );
  }
  return key;
}

interface FlickrSearchResponse {
  photos?: {
    photo?: Array<{
      id: string;
      owner: string;
      ownername?: string;
      title?: string;
      description?: { _content?: string };
      license?: string;
      url_l?: string;
      url_o?: string;
      url_z?: string;
      url_sq?: string;
      width_l?: number;
      height_l?: number;
      width_o?: number;
      height_o?: number;
      width_z?: number;
      height_z?: number;
    }>;
  };
  stat?: string;
  message?: string;
}

/**
 * Search Flickr for tractor photos.
 *
 * @param query     Free-text search query (e.g. "John Deere 8245R tractor")
 * @param limit     Max results to return (default 15, max 50 per Flickr API)
 * @returns         Array of FlickrCandidate objects (only CC-licensed, ≥ 600 px wide)
 */
export async function searchFlickr(
  query: string,
  limit = 15,
): Promise<FlickrCandidate[]> {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    method: 'flickr.photos.search',
    api_key: apiKey,
    text: query,
    license: COMMERCIAL_SAFE_LICENSES,
    sort: 'relevance',
    content_type: '1',  // photos only (not screenshots or other)
    media: 'photos',
    format: 'json',
    nojsoncallback: '1',
    per_page: String(Math.min(limit, 50)),
    extras: 'url_l,url_o,url_z,url_sq,owner_name,license,description,tags,views',
  });

  const url = `${FLICKR_API}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'TractorsCompare/1.0 (+https://tractorscompare.com)',
    },
  });

  if (!res.ok) throw new Error(`Flickr API HTTP error: ${res.status}`);

  const data = (await res.json()) as FlickrSearchResponse;
  if (data.stat === 'fail') throw new Error(`Flickr API error: ${data.message}`);

  const photos = data.photos?.photo ?? [];
  const out: FlickrCandidate[] = [];

  for (const p of photos) {
    // Prefer url_l (1024px), fall back to url_z (640px) or url_o (original)
    const imageUrl = p.url_l ?? p.url_z ?? p.url_o;
    if (!imageUrl) continue;

    const width = p.width_l ?? p.width_z ?? p.width_o ?? 0;
    const height = p.height_l ?? p.height_z ?? p.height_o ?? 0;

    if (width < MIN_WIDTH) continue;

    const licenseId = p.license ?? '0';
    const licenseMeta = LICENSE_MAP[licenseId];
    if (!licenseMeta) continue; // unknown or non-commercial license

    const thumbUrl = p.url_sq
      ? p.url_sq
      : `https://live.staticflickr.com/65535/${p.id}_q.jpg`;

    out.push({
      id: p.id,
      owner: p.owner,
      ownerName: p.ownername ?? p.owner,
      title: p.title ?? '',
      description: p.description?._content ?? '',
      url: imageUrl,
      thumbUrl,
      width,
      height,
      licenseId,
      licenseShortName: licenseMeta.shortName,
      licenseType: licenseMeta.licenseType,
      licenseUrl: licenseMeta.url,
      sourcePageUrl: `https://www.flickr.com/photos/${p.owner}/${p.id}`,
    });
  }

  return out;
}

// ---------------------------------------------------------------------------
// Scoring (same approach as Wikimedia scorer)
// ---------------------------------------------------------------------------

/**
 * Scores a Flickr candidate for relevance to a specific tractor brand+model.
 * Higher = more likely to be the right image.
 */
export function scoreFlickrCandidate(
  c: FlickrCandidate,
  brandTokens: string[],
  modelTokens: string[],
): number {
  let score = 0;
  const text = `${c.title} ${c.description}`.toLowerCase();

  if (c.width >= 1024) score += 30;
  else if (c.width >= 600) score += 15;

  if (/\btractor\b/.test(text)) score += 20;

  for (const t of brandTokens) {
    if (t.length >= 2 && text.includes(t.toLowerCase())) score += 25;
  }
  for (const t of modelTokens) {
    if (t.length >= 1 && text.includes(t.toLowerCase())) score += 30;
  }

  // High-view photos are usually real/well-tagged
  return score;
}

// ---------------------------------------------------------------------------
// Attribution
// ---------------------------------------------------------------------------

export function buildFlickrAttributionHtml(c: FlickrCandidate): string {
  return (
    `Photo by <a href="https://www.flickr.com/people/${c.owner}">${c.ownerName}</a>, ` +
    `<a href="${c.licenseUrl}">${c.licenseShortName}</a>, ` +
    `via <a href="${c.sourcePageUrl}">Flickr</a>`
  );
}

export function buildFlickrAttributionText(c: FlickrCandidate): string {
  return `Photo by ${c.ownerName}, ${c.licenseShortName}, via Flickr`;
}

// ---------------------------------------------------------------------------
// Availability check
// ---------------------------------------------------------------------------

/** Returns true if FLICKR_API_KEY is set in the environment. */
export function isFlickrAvailable(): boolean {
  return Boolean(process.env.FLICKR_API_KEY);
}
