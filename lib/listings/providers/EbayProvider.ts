import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';
import { fetchWithTimeout } from '@/lib/listings/utils';

const EBAY_API_BASE = 'https://svcs.ebay.com/services/search/FindingService/v1';
// eBay category 31440 = Farm Tractors & Equipment
const CATEGORY_ID = '31440';

function buildSearchUrl(query: string): string {
  const params = new URLSearchParams({
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': process.env.EBAY_APP_ID ?? '',
    'RESPONSE-DATA-FORMAT': 'JSON',
    'REST-PAYLOAD': '',
    keywords: query,
    'categoryId': CATEGORY_ID,
    'paginationInput.entriesPerPage': '1',
    'sortOrder': 'BestMatch',
  });
  return `${EBAY_API_BASE}?${params.toString()}`;
}

interface EbayItem {
  title?: string[];
  viewItemURL?: string[];
  galleryURL?: string[];
  sellingStatus?: { currentPrice?: { __value__?: string; '@currencyId'?: string }[] }[];
  location?: string[];
}

interface EbayResponse {
  findItemsByKeywordsResponse?: {
    searchResult?: { item?: EbayItem[] }[];
    ack?: string[];
  }[];
}

export const EbayProvider: ListingProvider = {
  id: 'ebay',
  name: 'eBay',

  async searchFirst(query: string): Promise<Listing | null> {
    const appId = process.env.EBAY_APP_ID;
    if (!appId) return null;

    try {
      const url = buildSearchUrl(query);
      const res = await fetchWithTimeout(url, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;

      const data = (await res.json()) as EbayResponse;
      const response = data.findItemsByKeywordsResponse?.[0];
      if (response?.ack?.[0] !== 'Success') return null;

      const item = response.searchResult?.[0]?.item?.[0];
      if (!item) return null;

      const title = item.title?.[0];
      const listingUrl = item.viewItemURL?.[0];
      if (!title || !listingUrl) return null;

      const priceObj = item.sellingStatus?.[0]?.currentPrice?.[0];
      const priceText = priceObj?.__value__
        ? `${priceObj['@currencyId'] ?? 'USD'} ${priceObj.__value__}`
        : undefined;

      return {
        marketplaceId: 'ebay',
        marketplaceName: 'eBay',
        title: title.slice(0, 200),
        listingUrl,
        imageUrl: item.galleryURL?.[0],
        priceText,
        locationText: item.location?.[0],
      };
    } catch (e) {
      console.error('[EbayProvider]', e);
      return null;
    }
  },
};
