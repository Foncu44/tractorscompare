import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';
import { isScrapeEnabled } from '@/lib/listings/featureFlag';
import { fetchHtml } from '@/lib/listings/utils';
import * as cheerio from 'cheerio';

const BASE = 'https://www.machinerytrader.com';

function buildSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query.trim());
  return `${BASE}/listings/search?Keyword=${encoded}`;
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
      'a[href*="/listings/"]',
      'a[href*="/listing/"]',
      'a[href*="/detail/"]',
      '.listing-title a',
      '.listing-card a',
      '[data-listing-id] a',
      'article a[href*="machinerytrader"]',
    ];

    let linkEl: ReturnType<typeof $> | null = null;
    for (const sel of selectors) {
      const el = $(sel).first();
      if (el.length) {
        const href = el.attr('href');
        if (href && href.includes('machinerytrader.com') && !href.includes('search') && !href.includes('javascript')) {
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

    const card = linkEl.closest('article, .listing-card, .listing-title, [data-listing-id], .listing, tr');
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
    const locEl = card.length ? card.find('[class*="location"], [class*="Location"]').first() : $('[class*="location"]').first();
    if (locEl.length) locationText = locEl.text().trim().replace(/\s+/g, ' ').slice(0, 80);

    return {
      marketplaceId: 'machinerytrader',
      marketplaceName: 'MachineryTrader',
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

export const MachineryTraderProvider: ListingProvider = {
  id: 'machinerytrader',
  name: 'MachineryTrader',
  async searchFirst(query: string): Promise<Listing | null> {
    if (!isScrapeEnabled()) return null;
    try {
      const url = buildSearchUrl(query);
      const html = await fetchHtml(url);
      return parseFirstListing(html, url);
    } catch (e) {
      console.error('[MachineryTraderProvider]', e);
      return null;
    }
  },
};
