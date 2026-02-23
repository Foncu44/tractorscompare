import type { Listing } from '@/types/listings';

export interface ListingProvider {
  id: string;
  name: string;
  /** Returns first search result listing or null if unavailable / no API. */
  searchFirst(query: string): Promise<Listing | null>;
}
