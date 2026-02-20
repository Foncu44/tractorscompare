/**
 * Known tractor brand slugs and their display names.
 * Longest slugs first so we can match "new-holland" before "new" when deriving from slug.
 */

export interface BrandEntry {
  slug: string;
  displayName: string;
}

export const BRAND_CATALOG: BrandEntry[] = [
  { slug: 'john-deere', displayName: 'John Deere' },
  { slug: 'new-holland', displayName: 'New Holland' },
  { slug: 'massey-ferguson', displayName: 'Massey Ferguson' },
  { slug: 'deutz-fahr', displayName: 'Deutz-Fahr' },
  { slug: 'caseih', displayName: 'Case IH' },
  { slug: 'same', displayName: 'SAME' },
  { slug: 'fiat', displayName: 'Fiat' },
  { slug: 'ford', displayName: 'Ford' },
  { slug: 'kubota', displayName: 'Kubota' },
  { slug: 'fendt', displayName: 'Fendt' },
  { slug: 'valtra', displayName: 'Valtra' },
  { slug: 'claas', displayName: 'CLAAS' },
  { slug: 'jcb', displayName: 'JCB' },
  // Add more below; keep multi-part slugs (e.g. john-deere) so longest match works
];

/** Slug -> display name map for O(1) lookup after match */
const displayByNameSlug = new Map<string, string>(
  BRAND_CATALOG.map((e) => [e.slug, e.displayName])
);

/** Sorted by slug length descending for longest-prefix match */
const byLongestSlug = [...BRAND_CATALOG].sort(
  (a, b) => b.slug.length - a.slug.length
);

export function getBrandDisplayName(brandSlug: string): string {
  return displayByNameSlug.get(brandSlug) ?? toTitleCase(brandSlug);
}

export function getBrandSlugsByLongestFirst(): string[] {
  return byLongestSlug.map((e) => e.slug);
}

function toTitleCase(s: string): string {
  return s
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}
