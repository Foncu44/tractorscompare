/**
 * Feature flag for listings API calls.
 * LISTINGS_SCRAPE_ENABLED: "true" | "false" (default: "false")
 * When false: providers return null, API returns empty items.
 * When true: eBay (official API) and Wallapop (public API) providers are active.
 */
export function isScrapeEnabled(): boolean {
  return process.env.LISTINGS_SCRAPE_ENABLED === 'true';
}
