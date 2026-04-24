import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';
import { isScrapeEnabled } from '@/lib/listings/featureFlag';
import { fetchWithTimeout } from '@/lib/listings/utils';

// Wallapop category 12467 = Tractors / Agricultural machinery
// Coordinates default to Spain center (Madrid area) — Wallapop is primarily a Spain/EU marketplace
const BASE_URL = 'https://api.wallapop.com/api/v3/general/search';
const CATEGORY_ID = '12467';
const DEFAULT_LAT = '40.4168';
const DEFAULT_LNG = '-3.7038';

function buildSearchUrl(query: string): string {
  const params = new URLSearchParams({
    keywords: query,
    category_ids: CATEGORY_ID,
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LNG,
    order_by: 'relevance',
    distance: '200000',
    items_count: '1',
    language: 'en',
  });
  return `${BASE_URL}?${params.toString()}`;
}

interface WallapopItem {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  web_slug?: string;
  main_image?: { urls?: { small?: string; medium?: string } };
  location?: { city?: string; country_code?: string };
}

interface WallapopResponse {
  data?: {
    section?: {
      payload?: {
        items?: WallapopItem[];
      };
    };
  };
  search_objects?: WallapopItem[];
}

export const WallapopProvider: ListingProvider = {
  id: 'wallapop',
  name: 'Wallapop',

  async searchFirst(query: string): Promise<Listing | null> {
    if (!isScrapeEnabled()) return null;

    try {
      const url = buildSearchUrl(query);
      const res = await fetchWithTimeout(url, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://es.wallapop.com/',
          'X-DeviceOS': '0',
        },
      });
      if (!res.ok) return null;

      const data = (await res.json()) as WallapopResponse;

      // Wallapop API response shape varies; try both known structures
      const item =
        data?.data?.section?.payload?.items?.[0] ??
        data?.search_objects?.[0];

      if (!item) return null;

      const title = item.title;
      const slug = item.web_slug;
      if (!title || !slug) return null;

      const listingUrl = `https://es.wallapop.com/item/${slug}`;
      const imageUrl =
        item.main_image?.urls?.medium ?? item.main_image?.urls?.small;

      const priceText =
        item.price != null
          ? `${item.price} ${item.currency ?? 'EUR'}`
          : undefined;

      const locationText = [item.location?.city, item.location?.country_code]
        .filter(Boolean)
        .join(', ') || undefined;

      return {
        marketplaceId: 'wallapop',
        marketplaceName: 'Wallapop',
        title: title.slice(0, 200),
        listingUrl,
        imageUrl,
        priceText,
        locationText,
      };
    } catch (e) {
      console.error('[WallapopProvider]', e);
      return null;
    }
  },
};
