'use client';

/**
 * TractorImageGallery — full image gallery for a tractor detail page.
 *
 * Features:
 *  - Primary hero image (eager, fetchpriority=high, explicit dimensions → no CLS)
 *  - Thumbnail strip for additional images (lazy)
 *  - Click-to-expand lightbox (CSS-only, no JS library)
 *  - Attribution shown below each image (CC license compliance)
 *  - Inline JSON-LD ImageObject structured data for Google Images
 *  - Falls back gracefully to placeholder when no images exist
 *
 * Structured data output (injected inline):
 *   { "@type": "ImageObject", "url": "...", "width": ..., "height": ..., ... }
 *
 * Usage:
 *   <TractorImageGallery tractor={tractor} images={images} />
 *
 *   `images` is an array of TractorImage objects (from lib/tractorImages.ts or
 *   the published image registry).  The first image is treated as primary.
 */

import React, { useState } from 'react';
import TractorImagePlaceholder from './TractorImagePlaceholder';
import type { Tractor, TractorImage } from '@/types/tractor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Extended TractorImage with optional fields added by the new pipeline. */
interface ExtendedTractorImage extends TractorImage {
  thumbUrl?: string;
  altText?: string;
  width?: number;
  height?: number;
  attributionText?: string;
}

interface TractorImageGalleryProps {
  tractor: Tractor;
  /** Ordered list of images. Index 0 = primary / hero. */
  images: ExtendedTractorImage[];
}

// ---------------------------------------------------------------------------
// Inline JSON-LD for a single ImageObject
// ---------------------------------------------------------------------------

function ImageObjectSchema({
  image,
  tractor,
}: {
  image: ExtendedTractorImage;
  tractor: Tractor;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: image.url,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
    name: `${tractor.brand} ${tractor.model} tractor`,
    description: image.altText ?? `${tractor.brand} ${tractor.model} tractor image`,
    license: image.licenseUrl,
    acquireLicensePage: image.licenseUrl,
    creditText: image.attributionText ?? `Photo via ${image.source}`,
    creator: {
      '@type': 'Person',
      name: image.author,
    },
    copyrightNotice: image.author,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Attribution strip
// ---------------------------------------------------------------------------

function Attribution({ image }: { image: ExtendedTractorImage }) {
  if (!image.attributionHtml) return null;
  return (
    <p
      className="mt-1 text-xs text-gray-400 leading-tight text-center"
      dangerouslySetInnerHTML={{ __html: image.attributionHtml }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TractorImageGallery({ tractor, images }: TractorImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full">
        <TractorImagePlaceholder brand={tractor.brand} model={tractor.model} />
      </div>
    );
  }

  const primary = images[activeIdx];

  // Derive alt text
  const hp = tractor.engine?.powerHP;
  const baseAlt = [
    `${tractor.brand} ${tractor.model} tractor`,
    hp ? `${hp} HP` : null,
    tractor.category ?? null,
  ]
    .filter(Boolean)
    .join(' \u2013 ');
  const alt = primary.altText ?? baseAlt;

  return (
    <div className="w-full">
      {/* JSON-LD for primary image */}
      <ImageObjectSchema image={primary} tractor={tractor} />

      {/* Hero image */}
      <figure className="relative w-full overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary.url}
          alt={alt}
          width={primary.width ?? 1200}
          height={primary.height ?? 630}
          loading={activeIdx === 0 ? 'eager' : 'lazy'}
          decoding={activeIdx === 0 ? 'sync' : 'async'}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(activeIdx === 0 ? { fetchpriority: 'high' as any } : {})}
          className="w-full h-auto object-cover cursor-zoom-in"
          style={{ maxHeight: 520 }}
          onClick={() => setLightboxOpen(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {/* Expand hint */}
        <button
          type="button"
          aria-label="Expand image"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>

        <Attribution image={primary} />
      </figure>

      {/* Thumbnail strip (only when > 1 image) */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`View image ${idx + 1}`}
              onClick={() => setActiveIdx(idx)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                idx === activeIdx
                  ? 'border-green-500'
                  : 'border-transparent hover:border-green-300'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumbUrl ?? img.url}
                alt={img.altText ?? `${tractor.brand} ${tractor.model} – image ${idx + 1}`}
                width={80}
                height={60}
                loading="lazy"
                className="w-20 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Close lightbox"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primary.url}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            loading="eager"
            onClick={(e) => e.stopPropagation()}
          />
          {primary.attributionHtml && (
            <p
              className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60 px-4"
              dangerouslySetInnerHTML={{ __html: primary.attributionHtml }}
            />
          )}
        </div>
      )}
    </div>
  );
}
