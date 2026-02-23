/**
 * International used-tractor marketplaces: config for search links only.
 * URL building is in buildMarketplaceLinks (TractorHouse path, Mascus path, Facebook query, Google site search).
 */

export interface MarketplaceConfig {
  id: string;
  name: string;
  domain: string;
  /** Path to local asset under public, e.g. /marketplaces/agriaffaires.svg */
  logoPath: string;
  /** If true, we do not append UTM params (e.g. site may strip or break). */
  skipUtm?: boolean;
  /** Optional region label for display. */
  regionLabel?: string;
  /** Lower = higher in list. */
  priority: number;
}

export const MARKETPLACES: MarketplaceConfig[] = [
  {
    id: 'agriaffaires',
    name: 'Agriaffaires',
    domain: 'agriaffaires.com',
    logoPath: '/marketplaces/agriaffaires.svg',
    regionLabel: 'EU / Global',
    priority: 1,
  },
  {
    id: 'mascus',
    name: 'Mascus',
    domain: 'mascus.com',
    logoPath: '/marketplaces/mascus.svg',
    regionLabel: 'Global',
    priority: 2,
  },
  {
    id: 'machinerytrader',
    name: 'MachineryTrader',
    domain: 'machinerytrader.com',
    logoPath: '/marketplaces/machinerytrader.svg',
    regionLabel: 'US',
    priority: 3,
  },
  {
    id: 'tractorhouse',
    name: 'TractorHouse',
    domain: 'tractorhouse.com',
    logoPath: '/marketplaces/tractorhouse.svg',
    regionLabel: 'US',
    priority: 4,
  },
].sort((a, b) => a.priority - b.priority);

export function getMarketplaceById(id: string): MarketplaceConfig | undefined {
  return MARKETPLACES.find((m) => m.id === id);
}
