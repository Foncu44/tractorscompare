/**
 * Full provenance + lifecycle metadata for every tractor image.
 *
 * Lifecycle:
 *   pending → downloaded → (approved | rejected) → published
 *
 * Status meanings:
 *   pending    – candidate found, not yet downloaded / validated
 *   downloaded – file stored locally, awaiting human review
 *   approved   – reviewed and cleared for publication
 *   rejected   – rejected (see rejection_reason); never shown
 *   published  – live on the site; entry written to tractor-images.json
 */

export type ImageStatus = 'pending' | 'downloaded' | 'approved' | 'rejected' | 'published';

/** Where the image came from. */
export type ImageSourceType =
  | 'wikimedia_commons'    // Wikimedia Commons (CC0 / CC-BY / CC-BY-SA / PD)
  | 'official_manufacturer'// Manufacturer's own press gallery (requires manual clearance)
  | 'manual_upload'        // Uploaded directly by the editorial team
  | 'stock_licensed';      // Purchased stock image with commercial license

/** Normalised SPDX-style license identifier. */
export type LicenseType =
  | 'CC0'
  | 'PD'           // Public domain (pre-1928 / US govt / author-released)
  | 'CC-BY'
  | 'CC-BY-SA'
  | 'licensed'     // Commercial/editorial license, attribution not required
  | 'unknown';     // Rights unclear — must not be published without review

export interface TractorImageRecord {
  /** Unique stable ID (nanoid 12). */
  id: string;

  /** Tractor slug (e.g. "john-deere-8245r"). Foreign key into tractors dataset. */
  tractor_id: string;

  /** Original image URL at the source (before local copy). */
  source_url: string;

  /** Hostname of source (e.g. "upload.wikimedia.org"). */
  source_domain: string;

  /** Categorisation of the image source. */
  source_type: ImageSourceType;

  /** License under which the image is published. */
  license_type: LicenseType;

  /** Raw copyright string from the source metadata (may contain HTML). */
  copyright_notice: string;

  /** Plain-text attribution ready for display. */
  attribution_text: string;

  /** HTML attribution string with hyperlinks (for Wikimedia compliance). */
  attribution_html: string;

  /** True if sourced directly from the tractor manufacturer's official channel. */
  is_official_source: boolean;

  /**
   * 0–1 score indicating how well this image matches the specific tractor.
   * Computed from title/description token overlap with brand+model.
   */
  confidence_score: number;

  /** Original image width in pixels (before optimisation). */
  width: number;

  /** Original image height in pixels (before optimisation). */
  height: number;

  /** MIME type of the original file (e.g. "image/jpeg"). */
  mime_type: string;

  /**
   * SHA-256 hex digest of the original downloaded buffer, prefixed "sha256:".
   * Used for duplicate detection. Null until downloaded.
   */
  file_hash: string | null;

  /**
   * Path to the optimised WebP file relative to the project root
   * (e.g. "public/images/tractors/john-deere-8245r-245hp-tractor.webp").
   * Null until optimised.
   */
  local_path: string | null;

  /**
   * Public URL served from /public (e.g. "/images/tractors/john-deere-8245r-245hp-tractor.webp").
   * Null until optimised.
   */
  cdn_url: string | null;

  /**
   * Public URL of the 400-px thumbnail WebP.
   * Null until optimised.
   */
  cdn_url_thumb: string | null;

  /** SEO-descriptive alt text (e.g. "John Deere 8245R tractor – 245 HP row crop"). */
  alt_text: string;

  /**
   * Descriptive SEO filename (without directory path).
   * E.g. "john-deere-8245r-245hp-tractor.webp"
   */
  seo_filename: string;

  /** True if this is the primary (hero) image for the tractor page. */
  is_primary: boolean;

  /** Review workflow status. */
  status: ImageStatus;

  /**
   * Human-readable reason for rejection (e.g. "watermark", "too_small",
   * "wrong_tractor", "duplicate", "unknown_rights").
   */
  rejection_reason: string | null;

  /** ISO-8601 timestamp when the record was approved or rejected. */
  reviewed_at: string | null;

  /** ISO-8601 timestamp when this record was first created. */
  created_at: string;

  /** ISO-8601 timestamp when this record was last modified. */
  updated_at: string;
}
