/**
 * Build outbound used-listings links for marketplaces. No API calls; static URLs only.
 * Adds UTM params where supported for referral tracking.
 *
 * Example for tractor "John Deere 850" (brandName: "John Deere", modelName: "850"):
 * - Agriaffaires: .../used/farm-tractors/?Keywords=John%20Deere%20850&utm_source=tractorscompare&...
 * - Mascus: .../search?searchterm=John%20Deere%20850&utm_source=tractorscompare&...
 * - MachineryTrader: .../listings/search?Keyword=John%20Deere%20850&utm_source=tractorscompare&...
 * - TractorHouse: .../listings/search?Keyword=John%20Deere%20850&utm_source=tractorscompare&...
 * - Facebook Marketplace: .../marketplace/search/?query=John%20Deere%20850 (no UTM)
 * Broader query: "John Deere tractor"
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

/**
 * Best search query for exact model: "Brand Model" (e.g. "John Deere 850").
 */
function buildExactQuery(input: MarketplaceLinkInput): string {
  const brand = (input.brandName || '').trim();
  const model = (input.modelName || '').trim();
  if (brand && model) return `${brand} ${model}`.trim();
  return (input.fullName || '').trim() || input.slug.replace(/-/g, ' ');
}

/**
 * Broader query for "few results" fallback: brand only or "Brand tractor".
 */
function buildBroaderQuery(input: MarketplaceLinkInput): string {
  const brand = (input.brandName || '').trim();
  if (brand) return `${brand} tractor`;
  const full = (input.fullName || '').trim();
  if (full) return `${full} tractor`;
  return 'tractor';
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
 * Returns a list of outbound links for each marketplace: exact search query.
 */
export function buildMarketplaceLinks(input: MarketplaceLinkInput): MarketplaceLink[] {
  const exactQuery = buildExactQuery(input);
  return MARKETPLACES.map((m) => {
    let url = m.searchUrlTemplate(exactQuery);
    if (!m.skipUtm) url = appendUtm(url, m.id);
    return {
      marketplaceId: m.id,
      title: `Search ${m.name} for ${exactQuery}`,
      url,
      label: m.regionLabel || 'Global',
    };
  });
}

/**
 * Returns the single "broader query" link (e.g. first marketplace with broader search).
 * Used for "Search broader query" secondary CTA.
 */
export function buildBroaderSearchLink(input: MarketplaceLinkInput): {
  query: string;
  url: string;
  marketplaceId: string;
} | null {
  const broaderQuery = buildBroaderQuery(input);
  const first = MARKETPLACES[0];
  if (!first) return null;
  let url = first.searchUrlTemplate(broaderQuery);
  if (!first.skipUtm) url = appendUtm(url, first.id);
  return {
    query: broaderQuery,
    url,
    marketplaceId: first.id,
  };
}
