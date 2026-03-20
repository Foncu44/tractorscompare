/**
 * Image download, validation, hashing, and WebP optimisation utilities.
 * Requires `sharp` (npm install sharp).
 *
 * Used exclusively in build-time / offline scripts — never imported by
 * Next.js runtime code.  Import with a dynamic await import('sharp') so
 * the module does not break the edge/node runtime if accidentally required.
 */

import https from 'https';
import http from 'http';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum acceptable image width in pixels. */
export const MIN_WIDTH = 600;

/** Minimum acceptable image height in pixels. */
export const MIN_HEIGHT = 400;

/** Maximum file size accepted (bytes). 20 MB. */
export const MAX_BYTES = 20 * 1024 * 1024;

/** MIME types we accept. */
export const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/** Public output directory (relative to project root). */
export const IMAGES_PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'tractors');

// ---------------------------------------------------------------------------
// Directory helpers
// ---------------------------------------------------------------------------

export function ensureImageDir(): void {
  if (!fs.existsSync(IMAGES_PUBLIC_DIR)) {
    fs.mkdirSync(IMAGES_PUBLIC_DIR, { recursive: true });
  }
}

// ---------------------------------------------------------------------------
// HTTP download
// ---------------------------------------------------------------------------

/**
 * Downloads an image URL into a Buffer.
 * Follows up to 5 redirects. Enforces MAX_BYTES limit.
 */
export function fetchImageBuffer(url: string, redirectsLeft = 5): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(
      url,
      {
        timeout: 20_000,
        headers: {
          'User-Agent': 'TractorsCompare-ImageBot/1.0 (+https://tractorscompare.com)',
          Accept: 'image/webp,image/jpeg,image/png,*/*',
        },
      },
      (res) => {
        // Handle redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          if (redirectsLeft <= 0) {
            reject(new Error('Too many redirects'));
            return;
          }
          fetchImageBuffer(res.headers.location, redirectsLeft - 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }

        const chunks: Buffer[] = [];
        let totalBytes = 0;

        res.on('data', (chunk: Buffer) => {
          totalBytes += chunk.length;
          if (totalBytes > MAX_BYTES) {
            req.destroy();
            reject(new Error(`File too large (>${MAX_BYTES / 1024 / 1024} MB)`));
            return;
          }
          chunks.push(chunk);
        });

        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      },
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out: ${url}`));
    });
  });
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/** Returns "sha256:<hex>" for deduplication. */
export function hashBuffer(buf: Buffer): string {
  return 'sha256:' + crypto.createHash('sha256').update(buf).digest('hex');
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  ok: boolean;
  reason?: string;
  width?: number;
  height?: number;
  mime?: string;
}

/**
 * Validates an image buffer against size and dimension rules.
 * Returns { ok: true, width, height, mime } on success or { ok: false, reason } on failure.
 */
export async function validateImageBuffer(buf: Buffer): Promise<ValidationResult> {
  if (buf.length > MAX_BYTES) {
    return { ok: false, reason: `file_too_large (${Math.round(buf.length / 1024)} KB)` };
  }

  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default;
  } catch {
    throw new Error('sharp is not installed. Run: npm install sharp');
  }

  let meta: import('sharp').Metadata;
  try {
    meta = await sharp(buf).metadata();
  } catch {
    return { ok: false, reason: 'cannot_parse_image' };
  }

  const mime = `image/${meta.format ?? 'unknown'}`;
  if (!ALLOWED_MIMES.has(mime)) {
    return { ok: false, reason: `unsupported_mime:${mime}` };
  }

  const w = meta.width ?? 0;
  const h = meta.height ?? 0;

  if (w < MIN_WIDTH) return { ok: false, reason: `too_narrow:${w}px` };
  if (h < MIN_HEIGHT) return { ok: false, reason: `too_short:${h}px` };

  return { ok: true, width: w, height: h, mime };
}

// ---------------------------------------------------------------------------
// Optimisation
// ---------------------------------------------------------------------------

export interface OptimiseResult {
  /** Full-size WebP buffer (max 1200 px wide). */
  webpBuffer: Buffer;
  /** 400-px wide thumbnail WebP buffer. */
  thumbBuffer: Buffer;
  /** Width of the full-size WebP output. */
  width: number;
  /** Height of the full-size WebP output. */
  height: number;
}

/**
 * Converts a raw image buffer to:
 *  - Full-size WebP (≤ maxWidth px wide, quality 85)
 *  - Thumbnail WebP (400 px wide, quality 75)
 *
 * Also applies EXIF-based rotation correction.
 */
export async function optimiseImage(
  buf: Buffer,
  maxWidth = 1200,
): Promise<OptimiseResult> {
  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default;
  } catch {
    throw new Error('sharp is not installed. Run: npm install sharp');
  }

  // Full-size WebP
  const base = sharp(buf).rotate(); // auto-rotate from EXIF
  const meta = await base.metadata();
  const srcWidth = meta.width ?? 800;

  const fullPipeline = srcWidth > maxWidth
    ? base.resize(maxWidth, undefined, { withoutEnlargement: true })
    : base;

  const webpBuffer = await fullPipeline
    .webp({ quality: 85, effort: 4, smartSubsample: true })
    .toBuffer();

  // Thumbnail
  const thumbBuffer = await sharp(buf)
    .rotate()
    .resize(400, undefined, { withoutEnlargement: true })
    .webp({ quality: 75, effort: 4 })
    .toBuffer();

  const outMeta = await sharp(webpBuffer).metadata();

  return {
    webpBuffer,
    thumbBuffer,
    width: outMeta.width ?? 0,
    height: outMeta.height ?? 0,
  };
}

// ---------------------------------------------------------------------------
// File persistence
// ---------------------------------------------------------------------------

/**
 * Saves a buffer to IMAGES_PUBLIC_DIR/<filename>.
 * Returns the absolute path written.
 */
export function saveImageFile(filename: string, buf: Buffer): string {
  ensureImageDir();
  const fullPath = path.join(IMAGES_PUBLIC_DIR, filename);
  fs.writeFileSync(fullPath, buf);
  return fullPath;
}

/** Converts a bare filename to its public CDN URL (served from /public). */
export function toCdnUrl(filename: string): string {
  return `/images/tractors/${filename}`;
}

/** Converts a bare filename to the relative local_path (from project root). */
export function toLocalPath(filename: string): string {
  return `public/images/tractors/${filename}`;
}

/** Derives the thumbnail filename from the full-size filename. */
export function toThumbFilename(filename: string): string {
  // "john-deere-8245r-245hp-tractor.webp" → "john-deere-8245r-245hp-tractor-thumb.webp"
  return filename.replace(/\.webp$/, '-thumb.webp');
}
