import Link from 'next/link';
import type { SimilarTractorItem } from '@/lib/tractorPageContent';
import { GitCompare, ExternalLink } from 'lucide-react';

export interface SimilarTractorsProps {
  /** 3–6 similar tractors (same category, HP ±15%, prefer same brand) */
  similar: SimilarTractorItem[];
  /** Hub links e.g. [{ href: '/best/compact-tractors-under-50hp', label: 'Best compact tractors under 50 HP' }] */
  hubLinks?: Array<{ href: string; label: string }>;
  /** Current tractor name for heading */
  currentName?: string;
}

const DEFAULT_HUB_LINKS = [
  { href: '/best/compact-tractors-under-50hp', label: 'Best compact tractors under 50 HP' },
  { href: '/best/small-farm-tractors', label: 'Best small farm tractors' },
  { href: '/best/large-farm-tractors', label: 'Best large farm tractors' },
  { href: '/best/loader-tractors', label: 'Best tractors for loader work' },
];

export default function SimilarTractors({
  similar,
  hubLinks = DEFAULT_HUB_LINKS,
  currentName,
}: SimilarTractorsProps) {
  if (similar.length === 0) return null;

  return (
    <section
      className="mt-8 md:mt-12 bg-primary-50 rounded-xl p-6 md:p-8 border border-primary-200"
      aria-labelledby="similar-tractors-heading"
    >
      <h2 id="similar-tractors-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Compare with similar models
      </h2>

      <ul className="space-y-2 mb-6">
        {similar.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tractores/${t.slug}`}
              className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium"
            >
              <GitCompare className="h-4 w-4 flex-shrink-0" aria-hidden />
              {t.brand} {t.model}
            </Link>
          </li>
        ))}
      </ul>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Browse by category</h3>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {hubLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="inline-flex items-center gap-1 text-sm text-primary-700 hover:underline"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
