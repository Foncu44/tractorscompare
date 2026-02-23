import type { Listing } from '@/types/listings';

export interface ListingProvider {
  id: string;
  name: string;
  searchFirst(
    query: string,
    meta?: { brandSlug?: string; modelSlug?: string }
  ): Promise<Listing | null>;
}
