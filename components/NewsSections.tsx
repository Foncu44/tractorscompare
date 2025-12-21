'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type NewsCategory = 'all' | 'industry' | 'agriculture' | 'tractors';

export interface NewsItem {
  title: string;
  url: string;
  publishedAt: string; // ISO
  source?: string;
  imageUrl?: string;
  // Puede venir de distintas fuentes (y versiones antiguas del JSON)
  category?: string;
  excerpt?: string;
}

function isWithinLastMonths(publishedAtISO: string, months: number): boolean {
  const t = Date.parse(publishedAtISO);
  if (Number.isNaN(t)) return false;
  const now = Date.now();
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - months);
  return t >= cutoff.getTime();
}

function normalizeCategory(input?: string): Exclude<NewsCategory, 'all'> | undefined {
  if (!input) return undefined;
  const v = input.toLowerCase();
  if (v === 'agriculture' || v === 'agricultura') return 'agriculture';
  if (v === 'tractors' || v === 'tractores') return 'tractors';
  if (v === 'industry' || v === 'sector') return 'industry';
  return undefined;
}

function formatDateEn(publishedAtISO: string): string {
  const d = new Date(publishedAtISO);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NewsSections({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<NewsCategory>('all');

  // Client-side filter: even with static export, hide items older than 6 months.
  const recentItems = useMemo(() => {
    const filtered = (items || []).filter((i) => isWithinLastMonths(i.publishedAt, 6));
    filtered.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    return filtered;
  }, [items]);

  const sectorItems = useMemo(() => {
    const byCategory = active === 'all'
      ? recentItems
      : recentItems.filter((i) => normalizeCategory(i.category) === active);
    return byCategory;
  }, [recentItems, active]);

  const featured = sectorItems[0];
  const latest = recentItems.slice(0, 3);

  if (!recentItems.length) {
    return null;
  }

  return (
    <>
      {/* Industry news */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-12 md:py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-bold mb-4">Industry News</h2>
          <p className="text-white/80 text-lg max-w-3xl">
            Stay up to date with the latest in tractors, agricultural machinery and farming technology.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {([
              { key: 'all', label: 'All' },
              { key: 'agriculture', label: 'Agriculture' },
              { key: 'tractors', label: 'Tractors' },
              { key: 'industry', label: 'Industry' },
            ] as const).map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active === c.key ? 'bg-white text-green-900' : 'bg-white/10 hover:bg-white/20'
                }`}
                type="button"
              >
                {c.label}
              </button>
            ))}
            <div className="flex-1" />
            <Link href="/noticias" className="ml-auto text-white/90 hover:text-white font-semibold">
              View all →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured + Latest */}
      <section className="py-10 bg-[#fbf7f1]">
        <div className="container-custom">
          {featured && (
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative">
                  {/* image */}
                  <div className="w-full h-72 lg:h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                    {featured.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={featured.imageUrl}
                          alt={featured.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          onError={(e) => {
                            // Ocultar imagen si falla y mostrar placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                        <div className="text-gray-400 text-center p-8 absolute inset-0 items-center justify-center hidden" style={{ display: 'none' }}>
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No image available</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center p-8">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                  {featured.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-orange-500 text-white px-3 py-1 text-xs font-semibold">
                        {normalizeCategory(featured.category) === 'agriculture'
                          ? 'Agriculture'
                          : normalizeCategory(featured.category) === 'tractors'
                            ? 'Tractors'
                            : 'Industry'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-gray-600 text-lg mb-6">{featured.excerpt}</p>
                  )}
                  <div className="text-sm text-gray-500 flex items-center gap-3">
                    <span>{formatDateEn(featured.publishedAt)}</span>
                    {featured.source ? <span>· {featured.source}</span> : null}
                  </div>
                  <div className="mt-4 text-primary-700 font-semibold">Read full article →</div>
                </div>
              </div>
            </a>
          )}

          {/* Latest news */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold">Latest News</h3>
              <Link href="/noticias" className="text-gray-700 hover:text-primary-700 font-semibold">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latest.map((n) => (
                <a
                  key={`${n.url}-${n.publishedAt}`}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-44 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden relative">
                    {n.imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={n.imageUrl}
                          alt={n.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          onError={(e) => {
                            // Ocultar imagen si falla y mostrar placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                        <div className="text-gray-400 text-center p-4 absolute inset-0 items-center justify-center hidden" style={{ display: 'none' }}>
                          <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">{formatDateEn(n.publishedAt)}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{n.title}</h4>
                    {n.excerpt ? (
                      <p className="text-gray-600 text-sm line-clamp-3">{n.excerpt}</p>
                    ) : null}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

