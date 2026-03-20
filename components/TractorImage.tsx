'use client';

/**
 * TractorImage — SEO-optimised primary image for a tractor detail page.
 *
 * SEO features:
 *  - Descriptive alt text (brand + model + HP + category)
 *  - Explicit width / height to prevent layout shift (CLS = 0)
 *  - loading="lazy" for below-fold images, "eager" for hero
 *  - fetchpriority="high" on the LCP element
 *  - Structured data: ImageObject in JSON-LD (via TractorImageGallery)
 *  - Falls back to TractorImagePlaceholder when no image is available
 *
 * Usage:
 *   <TractorImage tractor={tractor} priority />
 */

import React from 'react';
import TractorImagePlaceholder from './TractorImagePlaceholder';
import type { Tractor } from '@/types/tractor';

// ---------------------------------------------------------------------------
// Attribution component (shown below image when license requires it)
// ---------------------------------------------------------------------------

interface AttributionProps {
  html: string;
}

function Attribution({ html }: AttributionProps) {
  return (
    <p
      className="mt-1 text-xs text-gray-400 leading-tight"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface TractorImageProps {
  tractor: Tractor;
  /** True for the hero / LCP image — sets eager loading + high fetch priority. */
  priority?: boolean;
  /** Additional CSS classes applied to the <figure> wrapper. */
  className?: string;
  /** Override the rendered width (px). Defaults to full container (CSS width: 100%). */
  width?: number;
  /** Override the rendered height (px). Defaults to 600. */
  height?: number;
  /** Show the attribution line. Defaults to true. */
  showAttribution?: boolean;
}

export default function TractorImage({
  tractor,
  priority = false,
  className = '',
  width,
  height = 600,
  showAttribution = true,
}: TractorImageProps) {
  const image = tractor.image;
  const imageUrl = image?.url ?? tractor.imageUrl;

  // Derive a rich alt text from tractor data
  const hp = tractor.engine?.powerHP;
  const altParts: string[] = [`${tractor.brand} ${tractor.model} tractor`];
  if (hp) altParts.push(`${hp} HP`);
  if (tractor.category) altParts.push(tractor.category);
  const alt = altParts.join(' \u2013 ');

  // Prefer stored alt text from image metadata when available
  const finalAlt = (image as { altText?: string } | undefined)?.altText ?? alt;

  if (!imageUrl) {
    return (
      <figure className={`relative w-full overflow-hidden rounded-lg ${className}`}>
        <TractorImagePlaceholder brand={tractor.brand} model={tractor.model} />
      </figure>
    );
  }

  return (
    <figure className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={finalAlt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(priority ? { fetchpriority: 'high' } : {})}
        className="w-full h-auto object-cover"
        style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
      />
      {showAttribution && image?.attributionHtml && (
        <Attribution html={image.attributionHtml} />
      )}
    </figure>
  );
}
