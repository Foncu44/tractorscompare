import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * Facebook Marketplace listing provider.
 * TODO: Integrate official Graph API or partner feed when available.
 * Do NOT scrape HTML unless explicitly enabled via feature flag.
 */
export const FacebookMarketplaceProvider: ListingProvider = {
  id: 'facebook-marketplace',
  name: 'Facebook Marketplace',
  async search(_query: string): Promise<Listing | null> {
    // TODO: Add official Facebook Marketplace API integration here
    return null;
  },
};
