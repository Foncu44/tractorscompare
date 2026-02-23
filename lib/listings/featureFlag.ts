/**
 * Feature flags for listings module.
 * LISTINGS_SCRAPE_ENABLED: "true" | "false" (default: "false")
 * When false: providers return null (no scraping). Optionally show search links via LISTINGS_FALLBACK_SEARCH_LINKS.
 * When true: MascusProvider and TractorHouseProvider attempt HTML fetch + parsing.
 * Scraping may violate ToS; enable only after reviewing marketplace terms.
 */

export function isScrapeEnabled(): boolean {
  return process.env.LISTINGS_SCRAPE_ENABLED === 'true';
}

/**
 * When no real listings found, show search links as fallback.
 * LISTINGS_FALLBACK_SEARCH_LINKS: "true" | "false" (default: "true" when scrape disabled, "false" when scrape enabled)
 */
export function isFallbackSearchLinksEnabled(): boolean {
  const env = process.env.LISTINGS_FALLBACK_SEARCH_LINKS;
  if (env === 'true') return true;
  if (env === 'false') return false;
  return !isScrapeEnabled();
}
