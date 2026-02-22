import type { Listing } from '@/types/listings';
import { MARKETPLACES } from '@/lib/marketplaces';

const UTM_PARAMS = {
  utm_source: 'tractorscompare',
  utm_medium: 'referral',
  utm_campaign: 'used_listings',
} as const;

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
 * Returns one pseudo-listing per marketplace: "Search {query} on {name}",
 * imageUrl = local marketplace logo, listingUrl = search URL (with UTM where supported).
 * Use when a real provider returns null so the UI always shows a card.
 */
export function getFallbackListings(query: string): Listing[] {
  const q = (query || '').trim() || 'tractor';
  return MARKETPLACES.map((m) => {
    let url = m.searchUrlTemplate(q);
    if (!m.skipUtm) url = appendUtm(url, m.id);
    return {
      marketplaceId: m.id,
      marketplaceName: m.name,
      title: `Search ${q} on ${m.name}`,
      imageUrl: m.logoPath,
      listingUrl: url,
    };
  });
}

/**
 * Returns a single fallback listing for a given marketplace id and query.
 * Used when the API needs one fallback for one provider.
 */
export function getFallbackListingForMarketplace(
  marketplaceId: string,
  query: string
): Listing | null {
  const m = MARKETPLACES.find((x) => x.id === marketplaceId);
  if (!m) return null;
  const q = (query || '').trim() || 'tractor';
  let url = m.searchUrlTemplate(q);
  if (!m.skipUtm) url = appendUtm(url, m.id);
  return {
    marketplaceId: m.id,
    marketplaceName: m.name,
    title: `Search ${q} on ${m.name}`,
    imageUrl: m.logoPath,
    listingUrl: url,
  };
}
