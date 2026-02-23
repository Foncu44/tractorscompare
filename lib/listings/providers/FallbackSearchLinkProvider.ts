import type { Listing } from '@/types/listings';
import { MARKETPLACES } from '@/lib/marketplaces';
import {
  buildSearchUrl,
  buildSearchContext,
  type SearchContext,
} from '@/lib/buildMarketplaceLinks';

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

/** Derive brand/model from full query: last token = model, rest = brand. */
function contextFromQueryOnly(query: string): SearchContext {
  const q = (query || '').trim() || 'tractor';
  const parts = q.split(/\s+/).filter(Boolean);
  const model = parts.length > 1 ? parts.pop()! : q;
  const brand = parts.length ? parts.join(' ') : q;
  return buildSearchContext(
    {
      brandName: brand,
      modelName: model,
      fullName: q,
      slug: q.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    },
    false
  );
}

/**
 * Returns one pseudo-listing per marketplace: "Search {query} on {name}",
 * imageUrl = local marketplace logo, listingUrl = search URL (same URL builders as buildMarketplaceLinks).
 * Optional brandName/modelName for accurate slugs when available (e.g. from tractor page).
 */
export function getFallbackListings(
  query: string,
  brandName?: string,
  modelName?: string
): Listing[] {
  const q = (query || '').trim() || 'tractor';
  const context =
    brandName !== undefined && modelName !== undefined
      ? buildSearchContext(
          {
            brandName,
            modelName,
            fullName: query,
            slug: (query || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          },
          false
        )
      : contextFromQueryOnly(q);

  return MARKETPLACES.map((m) => {
    let url = buildSearchUrl(m.id, context, m.domain);
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
 */
export function getFallbackListingForMarketplace(
  marketplaceId: string,
  query: string,
  brandName?: string,
  modelName?: string
): Listing | null {
  const m = MARKETPLACES.find((x) => x.id === marketplaceId);
  if (!m) return null;
  const q = (query || '').trim() || 'tractor';
  const context =
    brandName !== undefined && modelName !== undefined
      ? buildSearchContext(
          {
            brandName,
            modelName,
            fullName: query,
            slug: (query || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          },
          false
        )
      : contextFromQueryOnly(q);
  let url = buildSearchUrl(m.id, context, m.domain);
  if (!m.skipUtm) url = appendUtm(url, m.id);
  return {
    marketplaceId: m.id,
    marketplaceName: m.name,
    title: `Search ${q} on ${m.name}`,
    imageUrl: m.logoPath,
    listingUrl: url,
  };
}
