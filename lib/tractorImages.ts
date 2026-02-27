/**
 * Wikimedia Commons image + attribution by tractor slug.
 * Populated by scripts/fetchTractorImages.ts (data/tractor-images.json).
 */
import type { TractorImage } from '@/types/tractor';
import tractorImagesData from '@/data/tractor-images.json';

const map = tractorImagesData as Record<string, TractorImage>;

export function getTractorImage(slug: string): TractorImage | undefined {
  return map[slug];
}
