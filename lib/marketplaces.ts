/**
 * International used-tractor marketplaces: config for search links only.
 * No scraping; no embedded content. Local logos only.
 */

export interface MarketplaceConfig {
  id: string;
  name: string;
  domain: string;
  /** Path to local asset under public, e.g. /marketplaces/agriaffaires.svg */
  logoPath: string;
  /** Builds the search URL for a given query. Must encode the query internally. */
  searchUrlTemplate: (query: string) => string;
  /** If true, we do not append UTM params (e.g. site may strip or break). */
  skipUtm?: boolean;
  /** Optional region label for display. */
  regionLabel?: string;
  /** Lower = higher in list. */
  priority: number;
}

const encode = (q: string) => encodeURIComponent(q);

export const MARKETPLACES: MarketplaceConfig[] = [
  {
    id: 'agriaffaires',
    name: 'Agriaffaires',
    domain: 'agriaffaires.com',
    logoPath: '/marketplaces/agriaffaires.svg',
    searchUrlTemplate: (query) =>
      `https://www.agriaffaires.com/used/farm-tractors/?Keywords=${encode(query)}`,
    regionLabel: 'EU / Global',
    priority: 1,
  },
  {
    id: 'mascus',
    name: 'Mascus',
    domain: 'mascus.com',
    logoPath: '/marketplaces/mascus.svg',
    searchUrlTemplate: (query) =>
      `https://www.mascus.com/search?searchterm=${encode(query)}`,
    regionLabel: 'Global',
    priority: 2,
  },
  {
    id: 'machinerytrader',
    name: 'MachineryTrader',
    domain: 'machinerytrader.com',
    logoPath: '/marketplaces/machinerytrader.svg',
    searchUrlTemplate: (query) =>
      `https://www.machinerytrader.com/listings/search?Keyword=${encode(query)}`,
    regionLabel: 'US',
    priority: 3,
  },
  {
    id: 'tractorhouse',
    name: 'TractorHouse',
    domain: 'tractorhouse.com',
    logoPath: '/marketplaces/tractorhouse.svg',
    searchUrlTemplate: (query) =>
      `https://www.tractorhouse.com/listings/search?Keyword=${encode(query)}`,
    regionLabel: 'US',
    priority: 4,
  },
  {
    id: 'facebook-marketplace',
    name: 'Facebook Marketplace',
    domain: 'facebook.com',
    logoPath: '/marketplaces/facebook-marketplace.svg',
    searchUrlTemplate: (query) =>
      `https://www.facebook.com/marketplace/search/?query=${encode(query)}`,
    skipUtm: true,
    regionLabel: 'Global',
    priority: 5,
  },
].sort((a, b) => a.priority - b.priority);

export function getMarketplaceById(id: string): MarketplaceConfig | undefined {
  return MARKETPLACES.find((m) => m.id === id);
}
