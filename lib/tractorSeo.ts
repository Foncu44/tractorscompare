/**
 * Canonical SEO helpers for tractor detail pages.
 * Single source of truth for title, description, keywords, and JSON-LD schemas.
 * All functions are pure / deterministic — same tractor → same output.
 */

import type { Metadata } from 'next';
import type { Tractor } from '@/types/tractor';
import type { FaqItem } from '@/lib/tractorPageContent';

const SITE_NAME = 'TractorsCompare';
const CURRENT_YEAR = 2026;

// ---------------------------------------------------------------------------
// Meta title & description
// ---------------------------------------------------------------------------

/**
 * "[Brand] [Model] Specs, Price & Review (2026) | TractorsCompare"
 * Optimised for CTR: front-loads the tractor name + core keywords.
 */
export function buildTractorTitle(tractor: Tractor): string {
  return `${tractor.brand} ${tractor.model} Specs, Price & Review (${CURRENT_YEAR}) | ${SITE_NAME}`;
}

/**
 * ES variant of the meta title.
 */
export function buildTractorTitleEs(tractor: Tractor): string {
  return `${tractor.brand} ${tractor.model} Especificaciones, Precio y Review (${CURRENT_YEAR}) | ${SITE_NAME}`;
}

/**
 * "Full specs, price and review of the [Brand] [Model]. Compare with similar tractors and find the best option."
 * Kept under 160 chars; includes brand + model + 3 core keyword intents.
 */
export function buildTractorDescription(tractor: Tractor): string {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const hpClause = tractor.engine?.powerHP ? ` ${tractor.engine.powerHP} HP.` : '.';
  return `Full specs, price and review of the ${fullName}${hpClause} Compare with similar tractors and find the best option for your farm.`;
}

export function buildTractorDescriptionEs(tractor: Tractor): string {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const hpClause = tractor.engine?.powerHP ? ` ${tractor.engine.powerHP} CV.` : '.';
  return `Especificaciones completas, precio y review del ${fullName}${hpClause} Compara con tractores similares y encuentra la mejor opción.`;
}

// ---------------------------------------------------------------------------
// Keyword list
// ---------------------------------------------------------------------------

export function buildTractorKeywords(tractor: Tractor, locale: 'en' | 'es' = 'en'): string[] {
  const { brand, model, engine, transmission, type } = tractor;
  const fullName = `${brand} ${model}`;

  if (locale === 'es') {
    return [
      `${fullName} especificaciones`,
      `${fullName} ficha técnica`,
      `${fullName} precio`,
      `${fullName} review`,
      `tractor ${brand}`,
      `${model} especificaciones`,
      `${model} potencia`,
      engine?.powerHP ? `${brand} ${engine.powerHP} CV` : null,
      transmission?.type ? `${fullName} transmisión ${transmission.type}` : null,
      type === 'farm' ? 'tractor agrícola especificaciones' : 'tractor jardín especificaciones',
    ].filter(Boolean) as string[];
  }

  return [
    `${fullName} specs`,
    `${fullName} specifications`,
    `${fullName} price`,
    `${fullName} review`,
    `${brand} tractor`,
    `${model} specs`,
    `${model} horsepower`,
    engine?.powerHP ? `${brand} ${engine.powerHP} HP tractor` : null,
    transmission?.type ? `${fullName} ${transmission.type} transmission` : null,
    type === 'farm' ? 'farm tractor specifications' : 'lawn tractor specifications',
    `${fullName} ${CURRENT_YEAR}`,
    `${fullName} used price`,
    `${fullName} technical data`,
  ].filter(Boolean) as string[];
}

// ---------------------------------------------------------------------------
// Metadata object (for generateMetadata)
// ---------------------------------------------------------------------------

/**
 * ISO-8601 published time for a tractor page.
 * Uses tractor.year if available, otherwise the site's original launch date.
 * Google Discover uses this for freshness scoring.
 */
function getTractorPublishedTime(tractor: Tractor): string {
  if (tractor.year) return `${tractor.year}-01-01T00:00:00Z`;
  if (tractor.productionYears?.start) return `${tractor.productionYears.start}-01-01T00:00:00Z`;
  return '2024-01-01T00:00:00Z'; // site launch fallback
}

/** Always use the current build date so Discover sees fresh content. */
function getModifiedTime(): string {
  return new Date().toISOString();
}

export function buildTractorMetadata(
  tractor: Tractor,
  locale: 'en' | 'es',
  canonicalUrl: string,
  alternates?: Record<string, string>
): Metadata {
  const isEs = locale === 'es';
  const title = isEs ? buildTractorTitleEs(tractor) : buildTractorTitle(tractor);
  const description = isEs ? buildTractorDescriptionEs(tractor) : buildTractorDescription(tractor);
  const keywords = buildTractorKeywords(tractor, locale);
  const publishedTime = getTractorPublishedTime(tractor);
  const modifiedTime = getModifiedTime();

  return {
    title,
    description,
    keywords,
    // og:type 'article' is required for Google Discover eligibility.
    // It also unlocks article:published_time / article:modified_time signals
    // that Discover uses for freshness ranking.
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: SITE_NAME,
      url: canonicalUrl,
      publishedTime,
      modifiedTime,
      authors: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com'}/about-us`],
      section: 'Tractors',
      tags: [
        `${tractor.brand} ${tractor.model}`,
        tractor.brand,
        tractor.type === 'farm' ? 'Agricultural Tractor' : tractor.type === 'lawn' ? 'Lawn Tractor' : 'Industrial Tractor',
        ...(keywords.slice(0, 6)),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    // Explicitly tell crawlers large image previews are allowed (belt + suspenders
    // alongside the root layout robots setting).
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD: Product schema
// ---------------------------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export interface ProductSchemaInput {
  tractor: Tractor;
  /** Actual tractor photo URL (e.g. Wikimedia). */
  imageUrl?: string;
  pageUrl: string;
  /** Locale — used to build the OG image URL as a fallback ImageObject. */
  locale?: 'en' | 'es';
}

export function buildProductSchema({ tractor, imageUrl, pageUrl, locale = 'en' }: ProductSchemaInput) {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const yearSuffix = tractor.year ? ` ${tractor.year}` : '';

  const additionalProperty = [
    tractor.engine?.powerHP
      ? { '@type': 'PropertyValue', name: 'Engine Power', value: `${tractor.engine.powerHP} HP` }
      : null,
    tractor.engine?.cylinders
      ? { '@type': 'PropertyValue', name: 'Engine Cylinders', value: String(tractor.engine.cylinders) }
      : null,
    tractor.engine?.displacement
      ? { '@type': 'PropertyValue', name: 'Displacement', value: `${tractor.engine.displacement} L` }
      : null,
    tractor.engine?.fuelType
      ? { '@type': 'PropertyValue', name: 'Fuel Type', value: tractor.engine.fuelType }
      : null,
    tractor.transmission?.type
      ? { '@type': 'PropertyValue', name: 'Transmission', value: tractor.transmission.type }
      : null,
    tractor.transmission?.gears
      ? { '@type': 'PropertyValue', name: 'Gears', value: String(tractor.transmission.gears) }
      : null,
    tractor.weight
      ? { '@type': 'PropertyValue', name: 'Operating Weight', value: `${tractor.weight} kg` }
      : null,
    tractor.ptoHP
      ? { '@type': 'PropertyValue', name: 'PTO Power', value: `${tractor.ptoHP} HP` }
      : null,
    tractor.ptoRPM
      ? { '@type': 'PropertyValue', name: 'PTO Speed', value: `${tractor.ptoRPM} RPM` }
      : null,
    tractor.hydraulicSystem?.liftCapacity
      ? { '@type': 'PropertyValue', name: 'Hydraulic Lift Capacity', value: `${tractor.hydraulicSystem.liftCapacity} kg` }
      : null,
  ].filter(Boolean);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${fullName}${yearSuffix}`,
    description:
      tractor.description ||
      `Complete specs and review for the ${fullName} tractor. ${tractor.engine?.powerHP ? `${tractor.engine.powerHP} HP` : ''} ${tractor.type === 'farm' ? 'agricultural' : tractor.type} tractor.`,
    brand: { '@type': 'Brand', name: tractor.brand },
    manufacturer: { '@type': 'Organization', name: tractor.brand },
    category: tractor.category || (tractor.type === 'farm' ? 'Agricultural Tractor' : tractor.type === 'lawn' ? 'Lawn Tractor' : 'Industrial Tractor'),
    url: pageUrl,
    additionalProperty,
  };

  // Always include at least one ImageObject.
  // Prefer the actual tractor photo; fall back to the dynamic OG image
  // (generated by opengraph-image.tsx) which is guaranteed to exist for all tractors.
  const ogImageUrl = `${BASE_URL}${pageUrl.replace(BASE_URL, '')}/opengraph-image`;

  if (imageUrl) {
    // Both images: the real tractor photo AND the OG image
    schema.image = [
      {
        '@type': 'ImageObject',
        url: imageUrl,
        description: `${fullName} tractor specs`,
        name: `${fullName} tractor`,
        // Width/height unknown for external images; omit to avoid invalid markup.
      },
      {
        '@type': 'ImageObject',
        url: ogImageUrl,
        description: `${fullName} Specs, Price and Review`,
        name: `${fullName} tractor overview`,
        width: 1200,
        height: 630,
        encodingFormat: 'image/png',
      },
    ];
  } else {
    // OG image only — still valid for Google rich results
    schema.image = {
      '@type': 'ImageObject',
      url: ogImageUrl,
      description: `${fullName} Specs, Price and Review`,
      name: `${fullName} tractor overview`,
      width: 1200,
      height: 630,
      encodingFormat: 'image/png',
    };
  }
  schema.thumbnailUrl = imageUrl ?? ogImageUrl;

  // Price / offers
  if (tractor.priceRange?.min || tractor.priceRange?.max) {
    schema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      ...(tractor.priceRange.min ? { lowPrice: String(tractor.priceRange.min) } : {}),
      ...(tractor.priceRange.max ? { highPrice: String(tractor.priceRange.max) } : {}),
      availability: 'https://schema.org/InStoreOnly',
    };
  }

  if (tractor.year) {
    schema.releaseDate = `${tractor.year}-01-01`;
    schema.modelDate = String(tractor.year);
  }

  if (tractor.productionYears?.start) {
    schema.productionDate = String(tractor.productionYears.start);
  }

  return schema;
}

// ---------------------------------------------------------------------------
// JSON-LD: BreadcrumbList schema
// ---------------------------------------------------------------------------

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// JSON-LD: FAQPage schema
// ---------------------------------------------------------------------------

export function buildFaqSchema(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// JSON-LD: Article schema (for blog pages)
// ---------------------------------------------------------------------------

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  authorName?: string;
}

export function buildArticleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedAt,
  authorName = 'TractorsCompare Editorial',
}: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://tractorscompare.com',
    },
    ...(imageUrl ? { image: { '@type': 'ImageObject', url: imageUrl } } : {}),
  };
}
