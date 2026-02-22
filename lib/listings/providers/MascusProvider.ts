import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * Mascus (global) listing provider.
 * TODO: Integrate official API or partner feed when available.
 * Do NOT scrape HTML unless explicitly enabled via feature flag.
 */
export const MascusProvider: ListingProvider = {
  id: 'mascus',
  name: 'Mascus',
  async search(_query: string): Promise<Listing | null> {
    // TODO: Add official Mascus API/feed integration here
    return null;
  },
};
