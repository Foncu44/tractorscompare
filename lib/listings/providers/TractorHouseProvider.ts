import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * TractorHouse (US) listing provider.
 * TODO: Integrate official API or partner feed when available.
 * Do NOT scrape HTML unless explicitly enabled via feature flag.
 */
export const TractorHouseProvider: ListingProvider = {
  id: 'tractorhouse',
  name: 'TractorHouse',
  async search(_query: string): Promise<Listing | null> {
    // TODO: Add official TractorHouse API/feed integration here
    return null;
  },
};
