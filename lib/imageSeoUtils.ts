/**
 * SEO utilities for tractor images.
 *
 * Generates:
 *  - Descriptive alt text       → used for <img alt=""> and og:image:alt
 *  - SEO filenames              → used for local storage and CDN path
 *  - Confidence score           → numeric match quality 0–1
 */

// ---------------------------------------------------------------------------
// Alt text
// ---------------------------------------------------------------------------

/**
 * Generates a meaningful, keyword-rich alt text for a tractor image.
 *
 * Examples:
 *  "John Deere 8245R tractor – 245 HP row crop"
 *  "Kubota M7-171 tractor – 171 HP farm"
 *  "John Deere 8245R tractor"        (when no HP available)
 */
export function generateAltText(
  brand: string,
  model: string,
  hp?: number,
  category?: string,
  type?: string,
): string {
  const base = `${brand} ${model} tractor`;
  const parts: string[] = [];

  if (hp) parts.push(`${hp} HP`);

  // Append a human-readable category/type only when it adds value
  const label = (category || type || '').toLowerCase().trim();
  const genericLabels = new Set(['farm', 'tractor', '']);
  if (label && !genericLabels.has(label)) {
    // Capitalise first letter
    parts.push(label.charAt(0).toUpperCase() + label.slice(1));
  }

  return parts.length > 0 ? `${base} \u2013 ${parts.join(', ')}` : base;
}

// ---------------------------------------------------------------------------
// SEO filenames
// ---------------------------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates a descriptive SEO filename for the full-size WebP.
 *
 * Pattern: {brand}-{model}-{hp}hp-tractor.webp
 * Example: "john-deere-8245r-245hp-tractor.webp"
 *          "kubota-m7-171-tractor.webp"   (when hp missing)
 */
export function generateSeoFilename(slug: string, hp?: number): string {
  const hpPart = hp ? `-${hp}hp` : '';
  return `${slug}${hpPart}-tractor.webp`;
}

/** Returns the thumbnail filename (same base, with -thumb suffix). */
export function generateThumbFilename(seoFilename: string): string {
  return seoFilename.replace(/\.webp$/, '-thumb.webp');
}

// ---------------------------------------------------------------------------
// Confidence score
// ---------------------------------------------------------------------------

/**
 * Computes a 0–1 score measuring how well an image title/description
 * matches the given tractor brand + model.
 *
 * Scoring:
 *   0.40  brand match
 *   0.40  model match
 *   0.10  word "tractor" present
 *   0.10  base score
 */
export function computeConfidenceScore(
  imageTitle: string,
  imageDescription: string | undefined,
  brand: string,
  model: string,
): number {
  const haystack = `${imageTitle} ${imageDescription ?? ''}`.toLowerCase();
  const brandNorm = brand.toLowerCase();
  const modelNorm = model.toLowerCase();

  // Tokenise model to handle multi-word models like "8245R" or "T8.435"
  const modelTokens = modelNorm
    .split(/[\s\-_./]+/)
    .filter((t) => t.length >= 1);

  let score = 0.1;

  if (haystack.includes(brandNorm)) score += 0.4;
  else {
    // Partial brand match (e.g. "Deere" in "John Deere")
    const brandTokens = brandNorm.split(/\s+/);
    if (brandTokens.some((t) => t.length >= 3 && haystack.includes(t))) score += 0.2;
  }

  const modelHit = modelTokens.some((t) => t.length >= 2 && haystack.includes(t));
  if (modelHit) score += 0.4;

  if (/\btractor\b/.test(haystack)) score += 0.1;

  return Math.min(Math.round(score * 100) / 100, 1.0);
}

// ---------------------------------------------------------------------------
// License normalisation
// ---------------------------------------------------------------------------

import type { LicenseType } from '@/types/tractorImageRecord';

/** Maps a Wikimedia Commons short license name to our LicenseType enum. */
export function normalizeLicense(licenseShortName: string): LicenseType {
  const s = (licenseShortName || '').toLowerCase().trim();
  if (!s) return 'unknown';
  if (s === 'cc0' || s.startsWith('cc0') || s.includes('creative commons zero')) return 'CC0';
  if (s.startsWith('pd') || s === 'public domain') return 'PD';
  if (s.includes('cc-by-sa') || s.includes('cc by-sa')) return 'CC-BY-SA';
  if (s.includes('cc-by') || s.includes('cc by')) return 'CC-BY';
  return 'unknown';
}
