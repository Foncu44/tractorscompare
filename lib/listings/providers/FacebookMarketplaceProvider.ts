import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * Facebook Marketplace listing provider.
 * Stub: returns null. TODO: Integrate official Graph API or partner feed when available.
 */
export const FacebookMarketplaceProvider: ListingProvider = {
  id: 'facebook-marketplace',
  name: 'Facebook Marketplace',
  async searchFirst(_query: string): Promise<Listing | null> {
    return null;
  },
};
