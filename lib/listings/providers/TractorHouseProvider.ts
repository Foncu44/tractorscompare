import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';
import { isScrapeEnabled } from '@/lib/listings/featureFlag';
import { fetchHtml } from '@/lib/listings/fetchHtml';
import { slugsFromQuery } from '@/lib/buildMarketplaceLinks';
import * as cheerio from 'cheerio';

/**
 * TractorHouse (US) listing provider.
 * When LISTINGS_SCRAPE_ENABLED=true: fetches search page, parses first listing.
 * Otherwise returns null.
 * TODO: Integrate official API or partner feed when available.
 */

function buildSearchUrl(query: string): string {
  const { brandSlug, modelSlug } = slugsFromQuery(query);
  return `https://www.tractorhouse.com/listings/for-sale/${brandSlug}/${modelSlug}/farm-equipment`;
}

function parseFirstListing(html: string, baseUrl: string): Listing | null {
  try {
    const $ = cheerio.load(html);
    const base = new URL(baseUrl);

    // TractorHouse often uses /listings/ for-sale /detail/ or similar
    const selectors = [
      'a[href*="/listings/for-sale/"]',
      'a[href*="/listing/"]',
      'a[href*="/detail/"]',
      '.listing-title a',
      '.listing-card a',
      '[data-listing-id] a',
      'article a[href*="tractorhouse"]',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let linkEl: any = null;
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const href = el.attr('href');
        if (href && href.includes('tractorhouse.com') && !href.includes('search') && !href.includes('javascript')) {
          linkEl = el;
          break;
        }
      }
    }

    if (!linkEl || !linkEl.length) return null;

    const href = linkEl.attr('href');
    if (!href) return null;

    const listingUrl = href.startsWith('http') ? href : new URL(href, base.origin).toString();
    const title = linkEl.attr('title') || linkEl.text().trim() || 'Listing';
    if (!title || title.length < 3) return null;

    const card = linkEl.closest('article, .listing-card, .listing-title, [data-listing-id], .listing, tr');
    let imageUrl: string | undefined;
    const img = card.length ? card.find('img').first() : linkEl.find('img').first();
    if (img.length) {
      const src = img.attr('src') || img.attr('data-src');
      if (src && src.startsWith('http')) imageUrl = src;
    }

    let priceText: string | undefined;
    const priceEl = card.length ? card.find('[class*="price"], [class*="Price"]').first() : $('[class*="price"]').first();
    if (priceEl.length) priceText = priceEl.text().trim().replace(/\s+/g, ' ');

    let locationText: string | undefined;
    const locEl = card.length ? card.find('[class*="location"], [class*="Location"]').first() : $('[class*="location"]').first();
    if (locEl.length) locationText = locEl.text().trim().replace(/\s+/g, ' ');

    return {
      marketplaceId: 'tractorhouse',
      marketplaceName: 'TractorHouse',
      title: title.slice(0, 200),
      priceText: priceText?.slice(0, 50),
      locationText: locationText?.slice(0, 80),
      imageUrl,
      listingUrl,
      isRealListing: true,
    };
  } catch {
    return null;
  }
}

export const TractorHouseProvider: ListingProvider = {
  id: 'tractorhouse',
  name: 'TractorHouse',
  async searchFirst(query: string): Promise<Listing | null> {
    if (!isScrapeEnabled()) return null;
    try {
      const url = buildSearchUrl(query);
      const html = await fetchHtml(url);
      return parseFirstListing(html, url);
    } catch (e) {
      console.error('[TractorHouseProvider]', e);
      return null;
    }
  },
};
