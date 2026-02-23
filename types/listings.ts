/**
 * Listing card data for used-tractor marketplaces.
 * Server-side fetched; only real listings (no fallback links).
 */

export type Listing = {
  marketplaceId: string;
  marketplaceName: string;
  title: string;
  listingUrl: string;
  imageUrl?: string;
  priceText?: string;
  locationText?: string;
};
