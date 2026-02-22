import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * MachineryTrader (US) listing provider.
 * TODO: Integrate official API or partner feed when available.
 * Do NOT scrape HTML unless explicitly enabled via feature flag.
 */
export const MachineryTraderProvider: ListingProvider = {
  id: 'machinerytrader',
  name: 'MachineryTrader',
  async search(_query: string): Promise<Listing | null> {
    // TODO: Add official MachineryTrader API/feed integration here
    return null;
  },
};
