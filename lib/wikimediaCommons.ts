/**
 * Wikimedia Commons API client for finding free-to-use tractor images.
 * Licenses: CC0, Public Domain, CC BY, CC BY-SA only (no NC, ND).
 */

const API = 'https://commons.wikimedia.org/w/api.php';
const COMMONS_PAGE = 'https://commons.wikimedia.org/wiki/File:';

/** Allowed license short names (commercial use). Excludes NC (NonCommercial) and ND (NoDerivatives). */
const ALLOWED_LICENSE_PATTERNS = [
  /^cc0$/i,
  /^public domain$/i,
  /^cc by(\s*-\s*sa)?\s*(\d+\.?\d*)?$/i,
  /^creative commons attribution(\s*-\s*sharealike)?/i,
  /^cc-by-sa/i,
  /^cc-by$/i,
  /^pd-/i, // Public domain variants
];

function hasNcOrNd(licenseStr: string): boolean {
  const s = (licenseStr || '').toLowerCase();
  return /\b(nc|non[- ]?commercial|no[- ]?derivatives|nd)\b/.test(s);
}

/** Returns true if the license is allowed for commercial use (CC0, PD, CC BY, CC BY-SA). */
export function isAllowedLicense(licenseShortName: string, licenseUrl?: string): boolean {
  const name = (licenseShortName || '').trim();
  if (hasNcOrNd(name)) return false;
  if (licenseUrl && hasNcOrNd(licenseUrl)) return false;
  if (!name) return false;
  return ALLOWED_LICENSE_PATTERNS.some((p) => p.test(name));
}

/** Prefer jpg/jpeg/png. */
const PREFERRED_EXT = /\.(jpg|jpeg|png)$/i;

export interface CommonsCandidate {
  title: string;
  pageid: number;
  url: string;
  thumbUrl?: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  licenseShortName: string;
  licenseUrl: string;
  author: string;
  description?: string;
}

function getExtMetadataValue(ext: Record<string, { value?: string }> | undefined, key: string): string {
  const raw = ext?.[key]?.value;
  if (typeof raw !== 'string') return '';
  const stripped = raw.replace(/<[^>]+>/g, '').trim();
  return stripped;
}

/** Wikimedia API query response shape (query.pages). */
interface CommonsQueryResponse {
  query?: { pages?: Record<string, unknown> };
}

/** Parse API response into candidates with license/author. */
export function parseSearchImageInfo(
  data: Record<string, unknown>,
  options: { minWidth?: number } = {}
): CommonsCandidate[] {
  const response = data as CommonsQueryResponse;
  const pages = response?.query?.pages;
  if (!pages || typeof pages !== 'object') return [];

  const minWidth = options.minWidth ?? 200;
  const out: CommonsCandidate[] = [];

  for (const pageId of Object.keys(pages)) {
    const p = pages[pageId] as Record<string, unknown>;
    if (pageId === '-1' || !p) continue;

    const title = (p.title as string) || '';
    const imageinfo = (p.imageinfo as unknown[])?.[0] as Record<string, unknown> | undefined;
    if (!imageinfo) continue;

    const url = imageinfo.url as string;
    const thumbUrl = imageinfo.thumburl as string | undefined;
    const width = (imageinfo.thumbwidth as number) ?? (imageinfo.width as number) ?? 0;
    const height = (imageinfo.thumbheight as number) ?? (imageinfo.height as number) ?? 0;
    const size = (imageinfo.size as number) ?? 0;
    const mime = (imageinfo.mime as string) ?? '';

    if (!url || width < minWidth) continue;

    const ext = imageinfo.extmetadata as Record<string, { value?: string }> | undefined;
    const licenseShortName = getExtMetadataValue(ext, 'LicenseShortName');
    const licenseUrl = getExtMetadataValue(ext, 'LicenseUrl');
    const author = getExtMetadataValue(ext, 'Artist');
    const description = getExtMetadataValue(ext, 'ImageDescription');

    if (!isAllowedLicense(licenseShortName, licenseUrl)) continue;

    out.push({
      title,
      pageid: (p.pageid as number) ?? 0,
      url,
      thumbUrl,
      width,
      height,
      size,
      mime,
      licenseShortName,
      licenseUrl,
      author,
      description,
    });
  }

  return out;
}

/** Score candidate for preference: resolution, "tractor" in title/description, file type. */
export function scoreCandidate(c: CommonsCandidate, brandTokens: string[], modelTokens: string[]): number {
  let score = 0;
  const titleLower = (c.title + ' ' + (c.description || '')).toLowerCase();

  if (c.width >= 800) score += 30;
  else if (c.width >= 400) score += 15;
  if (c.height >= 600) score += 20;
  else if (c.height >= 300) score += 10;

  if (/\.(jpg|jpeg|png)$/i.test(c.title)) score += 15;
  if (/tractor/i.test(titleLower)) score += 25;

  for (const t of brandTokens) {
    if (t.length >= 2 && titleLower.includes(t.toLowerCase())) score += 20;
  }
  for (const t of modelTokens) {
    if (t.length >= 1 && titleLower.includes(t.toLowerCase())) score += 25;
  }

  return score;
}

/** Search Commons for files; returns candidates with allowed licenses only. */
export async function searchCommons(
  searchQuery: string,
  limit: number = 15
): Promise<CommonsCandidate[]> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: searchQuery,
    gsrnamespace: '6',
    gsrlimit: String(Math.min(limit, 50)),
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '800',
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|ImageDescription',
  });

  const res = await fetch(`${API}?${params.toString()}`, {
    headers: { 'User-Agent': 'TractorsCompare/1.0 (https://tractorscompare.com; contact for images)' },
  });

  if (!res.ok) throw new Error(`Commons API error: ${res.status}`);
  const data = (await res.json()) as Record<string, unknown>;
  return parseSearchImageInfo(data, { minWidth: 200 });
}

/** Build attribution HTML for a chosen candidate. */
export function buildAttributionHtml(c: CommonsCandidate, sourcePageUrl: string): string {
  const author = c.author || 'Unknown';
  const license = c.licenseShortName || 'License';
  return `Photo by ${author}, <a href="${c.licenseUrl}">${license}</a>, via <a href="${sourcePageUrl}">Wikimedia Commons</a>`;
}
