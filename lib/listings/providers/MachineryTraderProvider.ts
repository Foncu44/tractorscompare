import type { ListingProvider } from './BaseProvider';
import type { Listing } from '@/types/listings';

/**
 * MachineryTrader (US) listing provider.
 * Stub: returns null. TODO: Integrate official API or partner feed when available.
 */
export const MachineryTraderProvider: ListingProvider = {
  id: 'machinerytrader',
  name: 'MachineryTrader',
  async searchFirst(_query: string): Promise<Listing | null> {
    return null;
  },
};
