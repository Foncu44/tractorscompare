import type { Listing } from '@/types/listings';
import type { ListingProvider } from './providers/BaseProvider';
import { AgriaffairesProvider } from './providers/AgriaffairesProvider';
import { MascusProvider } from './providers/MascusProvider';
import { MachineryTraderProvider } from './providers/MachineryTraderProvider';
import { TractorHouseProvider } from './providers/TractorHouseProvider';
import { FacebookMarketplaceProvider } from './providers/FacebookMarketplaceProvider';
import {
  getFallbackListingForMarketplace,
} from './providers/FallbackSearchLinkProvider';

const PROVIDERS: ListingProvider[] = [
  AgriaffairesProvider,
  MascusProvider,
  MachineryTraderProvider,
  TractorHouseProvider,
  FacebookMarketplaceProvider,
];

/**
 * For each marketplace provider: try search(q); if null or error, use fallback search link.
 * Failures per provider are isolated so one failing marketplace does not break the rest.
 */
export async function getListings(query: string): Promise<Listing[]> {
  const q = (query || '').trim() || 'tractor';
  const results: Listing[] = [];

  await Promise.all(
    PROVIDERS.map(async (provider) => {
      try {
        const listing = await provider.search(q);
        if (listing) {
          results.push(listing);
          return;
        }
      } catch {
        // ignore per-provider errors
      }
      const fallback = getFallbackListingForMarketplace(provider.id, q);
      if (fallback) results.push(fallback);
    })
  );

  // Keep stable order by provider order
  const order = new Map(PROVIDERS.map((p, i) => [p.id, i]));
  results.sort((a, b) => (order.get(a.marketplaceId) ?? 99) - (order.get(b.marketplaceId) ?? 99));
  return results;
}
