import Link from 'next/link';
import type { SimilarTractorItem } from '@/lib/tractorPageContent';
import { GitCompare, ExternalLink } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';
import { pathForLocale } from '@/lib/i18n/routes';

export interface SimilarTractorsProps {
  locale?: Locale;
  /** 3–6 similar tractors (same category, HP ±15%, prefer same brand) */
  similar: SimilarTractorItem[];
  /** Hub links e.g. [{ href: '/best/compact-tractors-under-50hp', label: 'Best compact tractors under 50 HP' }] */
  hubLinks?: Array<{ href: string; label: string }>;
  /** Current tractor name for heading */
  currentName?: string;
}

const DEFAULT_HUB_LINKS = [
  { href: '/best/compact-tractors-under-50hp', labelKey: 'similar.bestCompactUnder50' as const },
  { href: '/best/small-farm-tractors', labelKey: 'similar.bestSmallFarm' as const },
  { href: '/best/large-farm-tractors', labelKey: 'similar.bestLargeFarm' as const },
  { href: '/best/loader-tractors', labelKey: 'similar.bestLoaderWork' as const },
];

export default function SimilarTractors({
  locale = 'en',
  similar,
  hubLinks: hubLinksProp,
  currentName,
}: SimilarTractorsProps) {
  if (similar.length === 0) return null;

  const hubLinks = hubLinksProp ?? DEFAULT_HUB_LINKS.map(({ href, labelKey }) => ({ href, label: t(labelKey, undefined, locale) }));

  return (
    <section
      className="mt-8 md:mt-12 bg-primary-50 rounded-card p-6 md:p-8 border border-primary-200 shadow-card"
      aria-labelledby="similar-tractors-heading"
    >
      <h2 id="similar-tractors-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        {t('similar.title', undefined, locale)}
      </h2>

      <ul className="space-y-2 mb-6">
        {similar.map((t) => (
          <li key={t.slug}>
            <Link
              href={pathForLocale('tractors/' + t.slug, locale)}
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium"
            >
              <GitCompare className="h-4 w-4 flex-shrink-0" aria-hidden />
              {t.brand} {t.model}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('similar.browseByCategory', undefined, locale)}</h3>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {hubLinks.map((link, i) => (
            <li key={link.href}>
              <Link
                href={pathForLocale(link.href.replace(/^\//, ''), locale)}
                className="inline-flex items-center gap-1 text-sm text-primary-700 hover:underline"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
