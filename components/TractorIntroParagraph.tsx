/**
 * SEO intro paragraph for tractor detail pages.
 * Server component — no 'use client'; purely static HTML for crawlers.
 *
 * Renders 150–200 words containing the four core SEO keyword intents:
 *   "[model] specs" · "[model] price" · "[model] review" · "[brand] tractor"
 *
 * Uses pre-built text from data/intros.json when available (built by
 * `npm run build:narratives`). Falls back to runtime generation for any
 * tractor not yet in the cache — ensuring all 10,000+ tractors work on
 * first request without a rebuild.
 */

import type { Tractor } from '@/types/tractor';
import { buildIntroText } from '@/lib/tractorIntro';
import { introsMap } from '@/data/intros-map';

interface Props {
  tractor: Tractor;
  locale?: 'en' | 'es';
}

export default function TractorIntroParagraph({ tractor, locale = 'en' }: Props) {
  // Prefer pre-built text; fall back to runtime generation (O(1), deterministic)
  const cached = introsMap[tractor.slug];
  const text = cached ? cached[locale] : buildIntroText(tractor, locale);

  return (
    <section
      className="mt-6 md:mt-8 bg-white rounded-xl border border-gray-200 p-4 md:p-6"
      aria-label={locale === 'es' ? 'Descripción general' : 'Overview'}
    >
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
        {locale === 'es' ? 'Descripción general' : 'Overview'}
      </h2>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
        {text}
      </p>
    </section>
  );
}
