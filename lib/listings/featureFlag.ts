/**
 * Feature flag for listings scraping.
 * LISTINGS_SCRAPE_ENABLED: "true" | "false" (default: "false")
 * When false: providers return null, API returns empty items.
 * When true: providers attempt HTML fetch + parsing.
 * Scraping may violate ToS; enable only after reviewing marketplace terms.
 */
export function isScrapeEnabled(): boolean {
  return process.env.LISTINGS_SCRAPE_ENABLED === 'true';
}
