/**
 * Listing card data for used-tractor marketplaces.
 * Used by API and UI; imageUrl may be listing thumbnail or marketplace logo.
 */

export type Listing = {
  marketplaceId: string;
  marketplaceName: string;
  title: string;
  priceText?: string;
  locationText?: string;
  imageUrl?: string;
  listingUrl: string;
};
