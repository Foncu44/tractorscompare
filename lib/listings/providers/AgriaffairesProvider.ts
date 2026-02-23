import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';
import { isScrapeEnabled } from '@/lib/listings/featureFlag';
import { fetchHtml } from '@/lib/listings/utils';
import * as cheerio from 'cheerio';

const BASE = 'https://www.agriaffaires.com';

function buildSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query.trim());
  return `${BASE}/used/farm-tractors/?Keywords=${encoded}`;
}

function toAbsoluteUrl(href: string, baseOrigin: string): string {
  if (href.startsWith('http')) return href;
  try {
    return new URL(href, baseOrigin).toString();
  } catch {
    return href;
  }
}

function parseFirstListing(html: string, baseUrl: string): Listing | null {
  try {
    const $ = cheerio.load(html);
    const base = new URL(baseUrl);
    const origin = base.origin;

    const selectors = [
      'a[href*="/used/"]',
      'a[href*="/listing/"]',
      'a[href*="/ad/"]',
      '.listing-item a',
      '.search-result a[href*="agriaffaires"]',
      'article a',
      '[data-listing-id] a',
    ];

    let linkEl: ReturnType<typeof $> | null = null;
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const href = el.attr('href');
        if (href && href.includes('agriaffaires.com') && !href.includes('search') && !href.includes('javascript') && (href.includes('/used/') || href.includes('/ad/'))) {
          linkEl = el;
          break;
        }
      }
    }

    if (!linkEl || !linkEl.length) return null;

    const href = linkEl.attr('href');
    if (!href) return null;

    const listingUrl = toAbsoluteUrl(href, origin);
    const title = linkEl.attr('title') || linkEl.text().trim();
    if (!title || title.length < 3) return null;

    const card = linkEl.closest('article, .listing-item, .search-result, [data-listing-id], tr, .listing');
    let imageUrl: string | undefined;
    const img = card.length ? card.find('img').first() : linkEl.find('img').first();
    if (img.length) {
      const src = img.attr('src') || img.attr('data-src');
      if (src) imageUrl = toAbsoluteUrl(src, origin);
    }

    let priceText: string | undefined;
    const priceEl = card.length ? card.find('[class*="price"], [class*="Price"]').first() : $('[class*="price"]').first();
    if (priceEl.length) priceText = priceEl.text().trim().replace(/\s+/g, ' ').slice(0, 50);

    let locationText: string | undefined;
    const locEl = card.length ? card.find('[class*="location"], [class*="country"], [class*="Location"]').first() : $('[class*="location"]').first();
    if (locEl.length) locationText = locEl.text().trim().replace(/\s+/g, ' ').slice(0, 80);

    return {
      marketplaceId: 'agriaffaires',
      marketplaceName: 'Agriaffaires',
      title: title.slice(0, 200),
      listingUrl,
      imageUrl,
      priceText,
      locationText,
    };
  } catch {
    return null;
  }
}

export const AgriaffairesProvider: ListingProvider = {
  id: 'agriaffaires',
  name: 'Agriaffaires',
  async searchFirst(query: string): Promise<Listing | null> {
    if (!isScrapeEnabled()) return null;
    try {
      const url = buildSearchUrl(query);
      const html = await fetchHtml(url);
      return parseFirstListing(html, url);
    } catch (e) {
      console.error('[AgriaffairesProvider]', e);
      return null;
    }
  },
};
