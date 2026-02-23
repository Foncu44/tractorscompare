/**
 * Build outbound used-listings links for marketplaces. No API calls; static URLs only.
 * URLs open real search results: TractorHouse path, Mascus path, Facebook query, Google site search for Agriaffaires/MachineryTrader.
 * Query always = normalized.brandName + ' ' + normalized.modelName; encode with encodeURIComponent where needed.
 */

import { MARKETPLACES } from './marketplaces';

const UTM_PARAMS = {
  utm_source: 'tractorscompare',
  utm_medium: 'referral',
  utm_campaign: 'used_listings',
} as const;

export interface MarketplaceLinkInput {
  brandName: string;
  modelName: string;
  fullName: string;
  slug: string;
}

export interface MarketplaceLink {
  marketplaceId: string;
  title: string;
  url: string;
  label: string;
}

/** Slug for URL path: lowercase, spaces to hyphens, alphanumeric and hyphens only. */
export function slugify(s: string): string {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Mascus modelToken: up to 2 tokens from modelSlug (split by '-'), join with '+', lowercase. */
export function modelTokenFromSlug(modelSlug: string): string {
  const tokens = (modelSlug || '').split('-').filter(Boolean).slice(0, 2);
  return tokens.join('+').toLowerCase() || 'tractor';
}

export interface SearchContext {
  query: string;
  encodedQuery: string;
  brandSlug: string;
  modelSlug: string;
  modelToken: string;
}

/** Derive slugs from query string (e.g. "Claas Axion 820" -> brandSlug, modelSlug, modelToken). */
export function slugsFromQuery(query: string): { brandSlug: string; modelSlug: string; modelToken: string } {
  const q = (query || '').trim() || 'tractor';
  const parts = q.split(/\s+/).filter(Boolean);
  const model = parts.length > 1 ? parts.pop()! : q;
  const brand = parts.length ? parts.join(' ') : q;
  const brandSlug = slugify(brand) || 'tractor';
  const modelSlug = slugify(model) || 'tractor';
  const modelToken = modelTokenFromSlug(modelSlug);
  return { brandSlug, modelSlug, modelToken };
}

/** Build query = normalized.brandName + ' ' + normalized.modelName and slugs. */
export function buildSearchContext(
  input: MarketplaceLinkInput,
  broader: boolean = false
): SearchContext {
  const brand = (input.brandName || '').trim();
  const model = (input.modelName || '').trim();
  const normalizedBrand = brand || (input.fullName || '').trim() || input.slug.replace(/-/g, ' ');
  const normalizedModel = broader ? 'tractor' : (model || 'tractor');
  const query = `${normalizedBrand} ${normalizedModel}`.trim() || 'tractor';
  const encodedQuery = encodeURIComponent(query);
  const brandSlug = slugify(normalizedBrand) || 'tractor';
  const modelSlug = slugify(normalizedModel) || 'tractor';
  const modelToken = modelTokenFromSlug(modelSlug);
  return { query, encodedQuery, brandSlug, modelSlug, modelToken };
}

/**
 * Build search URL for a marketplace. Uses real search formats:
 * - TractorHouse: /listings/for-sale/{brandSlug}/{modelSlug}/farm-equipment
 * - Mascus: /agriculture/tractors/{brandSlug},{modelToken},1,relevance,search.html
 * - Facebook: /marketplace/search/?query={encodedQuery}
 * - Agriaffaires / MachineryTrader: Google site search (site:domain query)
 */
export function buildSearchUrl(
  marketplaceId: string,
  context: SearchContext,
  domain: string
): string {
  const { query, encodedQuery, brandSlug, modelSlug, modelToken } = context;
  switch (marketplaceId) {
    case 'tractorhouse':
      return `https://www.tractorhouse.com/listings/for-sale/${brandSlug}/${modelSlug}/farm-equipment`;
    case 'mascus':
      // Comma in path is encoded as %2C
      return `https://www.mascus.com/agriculture/tractors/${brandSlug}%2C${modelToken}%2C1%2Crelevance%2Csearch.html`;
    case 'facebook-marketplace':
      return `https://www.facebook.com/marketplace/search/?query=${encodedQuery}`;
    case 'agriaffaires':
    case 'machinerytrader':
      return `https://www.google.com/search?q=${encodeURIComponent(`site:${domain} ${query}`)}`;
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(`site:${domain} ${query}`)}`;
  }
}

function appendUtm(url: string, marketplaceId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', UTM_PARAMS.utm_source);
    u.searchParams.set('utm_medium', UTM_PARAMS.utm_medium);
    u.searchParams.set('utm_campaign', UTM_PARAMS.utm_campaign);
    u.searchParams.set('utm_content', marketplaceId);
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Returns a list of outbound links for each marketplace. Query = normalized.brandName + ' ' + normalized.modelName.
 * Each link is a real <a href> to a search results page.
 */
export function buildMarketplaceLinks(input: MarketplaceLinkInput): MarketplaceLink[] {
  const context = buildSearchContext(input, false);
  return MARKETPLACES.map((m) => {
    let url = buildSearchUrl(m.id, context, m.domain);
    if (!m.skipUtm) url = appendUtm(url, m.id);
    return {
      marketplaceId: m.id,
      title: `Search ${m.name} for ${context.query}`,
      url,
      label: m.regionLabel || 'Global',
    };
  });
}

/**
 * "Try broader search" link using brandName + ' tractor'.
 */
export function buildBroaderSearchLink(input: MarketplaceLinkInput): {
  query: string;
  url: string;
  marketplaceId: string;
} | null {
  const first = MARKETPLACES[0];
  if (!first) return null;
  const context = buildSearchContext(
    { ...input, modelName: 'tractor' },
    true
  );
  let url = buildSearchUrl(first.id, context, first.domain);
  if (!first.skipUtm) url = appendUtm(url, first.id);
  const brand = (input.brandName || '').trim();
  const broaderQuery = brand ? `${brand} tractor` : 'tractor';
  return {
    query: broaderQuery,
    url,
    marketplaceId: first.id,
  };
}
