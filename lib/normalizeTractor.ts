/**
 * Deterministic normalizer: derive brand/model from slug for consistent display and SEO.
 */

import {
  getBrandDisplayName,
  getBrandSlugsByLongestFirst,
} from './brandCatalog';

export interface NormalizedFromSlug {
  brandSlug: string;
  brandName: string;
  modelSlug: string;
  modelName: string;
  fullName: string;
}

const LONGEST_FIRST = getBrandSlugsByLongestFirst();

/**
 * Find the longest catalog brandSlug that is a prefix of slug (slug must continue with '-' after brand).
 */
function longestMatchingBrandSlug(slug: string): string | null {
  for (const brandSlug of LONGEST_FIRST) {
    if (slug === brandSlug || slug.startsWith(brandSlug + '-')) return brandSlug;
  }
  return null;
}

/**
 * Human-readable model name from modelSlug:
 * - Tokens containing digits => uppercase (acronym: mx200 => MX200, tc24d => TC24D)
 * - Else => Title Case (magnum => Magnum)
 * - Hyphens become spaces
 */
function modelSlugToModelName(modelSlug: string): string {
  if (!modelSlug) return '';
  return modelSlug
    .split('-')
    .map((token) => {
      if (/\d/.test(token)) return token.toUpperCase();
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Derive brand/model from slug deterministically.
 */
export function normalizeTractorFromSlug(slug: string): NormalizedFromSlug {
  const normalized = slug.trim().toLowerCase();
  const matched = longestMatchingBrandSlug(normalized);

  let brandSlug: string;
  let modelSlug: string;

  if (matched) {
    brandSlug = matched;
    modelSlug = normalized.slice(matched.length).replace(/^-/, '') || '';
  } else {
    const firstDash = normalized.indexOf('-');
    if (firstDash === -1) {
      brandSlug = normalized;
      modelSlug = '';
    } else {
      brandSlug = normalized.slice(0, firstDash);
      modelSlug = normalized.slice(firstDash + 1);
    }
  }

  const brandName = getBrandDisplayName(brandSlug);
  const modelName = modelSlugToModelName(modelSlug);
  const fullName = modelName ? `${brandName} ${modelName}` : brandName;

  return {
    brandSlug,
    brandName,
    modelSlug,
    modelName,
    fullName,
  };
}

export interface TractorWithSlug {
  id: string;
  slug: string;
  brand?: string;
  model?: string;
  [key: string]: unknown;
}

export interface NormalizedTractor extends TractorWithSlug {
  normalized: NormalizedFromSlug;
}

/**
 * Attach normalized fields to a tractor for SEO and display.
 */
export function normalizeTractor<T extends TractorWithSlug>(t: T): T & { normalized: NormalizedFromSlug } {
  const normalized = normalizeTractorFromSlug(t.slug);
  return { ...t, normalized };
}
