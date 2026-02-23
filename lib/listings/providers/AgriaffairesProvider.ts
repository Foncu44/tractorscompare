import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * Agriaffaires (EU/Global) listing provider.
 * Stub: returns null. TODO: Integrate official API or partner feed when available.
 * Scraping not implemented; HTML fetch may violate ToS.
 */
export const AgriaffairesProvider: ListingProvider = {
  id: 'agriaffaires',
  name: 'Agriaffaires',
  async searchFirst(_query: string): Promise<Listing | null> {
    return null;
  },
};
