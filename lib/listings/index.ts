import type { Listing } from '@/types/listings';
import type { ListingProvider } from './providers/BaseProvider';
import { EbayProvider } from './providers/EbayProvider';
import { WallapopProvider } from './providers/WallapopProvider';
import { runWithConcurrencyLimit } from './utils';
import { slugify } from '@/lib/buildMarketplaceLinks';

const PROVIDERS: ListingProvider[] = [
  EbayProvider,
  WallapopProvider,
];

const CONCURRENCY = 2;

/**
 * Run providers with concurrency limit 2. Collect only non-null results.
 * When LISTINGS_SCRAPE_ENABLED=false, all providers return null -> empty array.
 */
export async function getListings(
  query: string,
  brandName?: string,
  modelName?: string
): Promise<Listing[]> {
  const q = (query || '').trim() || 'tractor';
  const meta =
    brandName && modelName
      ? { brandSlug: slugify(brandName), modelSlug: slugify(modelName) }
      : undefined;

  const providerResults = await runWithConcurrencyLimit(
    PROVIDERS,
    async (provider) => {
      try {
        return await provider.searchFirst(q, meta);
      } catch (e) {
        console.error(`[listings] ${provider.id}:`, e);
        return null;
      }
    },
    CONCURRENCY
  );

  const results = providerResults.filter((l): l is Listing => l !== null);

  const order = new Map(PROVIDERS.map((p, i) => [p.id, i]));
  results.sort((a, b) => (order.get(a.marketplaceId) ?? 99) - (order.get(b.marketplaceId) ?? 99));

  return results;
}
