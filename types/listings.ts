/**
 * Listing card data for used-tractor marketplaces.
 * Used by API and UI; imageUrl may be listing thumbnail or marketplace logo.
 * isRealListing: true = from provider/scrape; false = fallback search link.
 */

export type Listing = {
  marketplaceId: string;
  marketplaceName: string;
  title: string;
  priceText?: string;
  locationText?: string;
  imageUrl?: string;
  listingUrl: string;
  isRealListing: boolean;
};
