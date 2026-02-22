import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * Agriaffaires (EU/Global) listing provider.
 * TODO: Integrate official API or partner feed when available.
 * Do NOT scrape HTML unless explicitly enabled via feature flag.
 */
export const AgriaffairesProvider: ListingProvider = {
  id: 'agriaffaires',
  name: 'Agriaffaires',
  async search(_query: string): Promise<Listing | null> {
    // TODO: Add official Agriaffaires API/feed integration here
    return null;
  },
};
