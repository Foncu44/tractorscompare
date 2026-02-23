import type { Listing } from '@/types/listings';
import type { ListingProvider } from './providers/BaseProvider';
import { AgriaffairesProvider } from './providers/AgriaffairesProvider';
import { MascusProvider } from './providers/MascusProvider';
import { MachineryTraderProvider } from './providers/MachineryTraderProvider';
import { TractorHouseProvider } from './providers/TractorHouseProvider';
import { FacebookMarketplaceProvider } from './providers/FacebookMarketplaceProvider';
import { getFallbackListings } from './providers/FallbackSearchLinkProvider';
import { isFallbackSearchLinksEnabled } from './featureFlag';

const PROVIDERS: ListingProvider[] = [
  AgriaffairesProvider,
  MascusProvider,
  MachineryTraderProvider,
  TractorHouseProvider,
  FacebookMarketplaceProvider,
];

const CONCURRENCY = 2;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

/**
 * Run providers with concurrency limit 2. Collect only non-null (real) listings.
 * If no real listings and fallback enabled, return search link cards.
 */
export async function getListings(
  query: string,
  brandName?: string,
  modelName?: string
): Promise<Listing[]> {
  const q = (query || '').trim() || 'tractor';
  const results: Listing[] = [];

  const chunks = chunk(PROVIDERS, CONCURRENCY);
  for (const providerChunk of chunks) {
    const chunkResults = await Promise.all(
      providerChunk.map(async (provider) => {
        try {
          return await provider.searchFirst(q);
        } catch (e) {
          console.error(`[listings] ${provider.id}:`, e);
          return null;
        }
      })
    );
    for (const listing of chunkResults) {
      if (listing && listing.isRealListing) {
        results.push(listing);
      }
    }
  }

  const order = new Map(PROVIDERS.map((p, i) => [p.id, i]));
  results.sort((a, b) => (order.get(a.marketplaceId) ?? 99) - (order.get(b.marketplaceId) ?? 99));

  if (results.length === 0 && isFallbackSearchLinksEnabled()) {
    return getFallbackListings(q, brandName, modelName);
  }

  return results;
}
