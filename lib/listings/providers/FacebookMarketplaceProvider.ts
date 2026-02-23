import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * Facebook Marketplace requires login to view listings.
 * Scraping is not feasible without authentication.
 * Returns null.
 */
export const FacebookMarketplaceProvider: ListingProvider = {
  id: 'facebook-marketplace',
  name: 'Facebook Marketplace',
  async searchFirst(_query: string): Promise<Listing | null> {
    return null;
  },
};
