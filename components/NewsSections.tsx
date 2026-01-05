'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function NewsSections({ items, showAll = false }: { items: NewsItem[]; showAll?: boolean }) {
  const [active, setActive] = useState<NewsCategory>('all');
  const [currentPage, setCurrentPage] = useState(0);

  // Client-side filter: even with static export, hide items older than 3 months.
  const recentItems = useMemo(() => {
    const filtered = (items || []).filter((i) => isWithinLastMonths(i.publishedAt, 3));
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
  
  // Para la página completa: paginación de 6 noticias
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sectorItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sectorItems.slice(startIndex, endIndex);
  
  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };
  
  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Resetear página cuando cambia la categoría
  useEffect(() => {
    setCurrentPage(0);
  }, [active]);

  if (!recentItems.length) {
    return null;
  }

  return (
    <>
      {/* Industry news */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-16 md:py-20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Industry News</h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl leading-relaxed">
              Stay up to date with the latest in tractors, agricultural machinery and farming technology.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {([
                { key: 'all', label: 'All' },
                { key: 'agriculture', label: 'Agriculture' },
                { key: 'tractors', label: 'Tractors' },
                { key: 'industry', label: 'Industry' },
              ] as const).map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active === c.key 
                      ? 'bg-white text-green-900 shadow-lg scale-105' 
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                  type="button"
                >
                  {c.label}
                </button>
              ))}
              <div className="flex-1" />
              <Link 
                href="/noticias" 
                className="ml-auto text-white/90 hover:text-white font-semibold transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-1"
              >
                View all 
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured + Latest */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#fbf7f1] to-white">
        <div className="container-custom">
          {featured && (
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative overflow-hidden">
                  {/* image */}
                  <div className="w-full h-72 lg:h-full min-h-[400px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                    {featured.imageUrl && featured.imageUrl.trim() ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          key={featured.imageUrl}
                          src={featured.imageUrl}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="eager"
                          decoding="async"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              target.style.display = 'none';
                              const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="image-placeholder text-gray-400 text-center p-8 absolute inset-0 items-center justify-center bg-gray-100" style={{ display: 'none' }}>
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
                    <div className="absolute top-6 left-6 z-10">
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 text-xs font-semibold shadow-lg">
                        {normalizeCategory(featured.category) === 'agriculture'
                          ? 'Agriculture'
                          : normalizeCategory(featured.category) === 'tractors'
                            ? 'Tractors'
                            : 'Industry'}
                      </span>
                    </div>
                  )}
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary-700 transition-colors duration-200">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed line-clamp-4">
                      {featured.excerpt.replace(/&nbsp;&nbsp;/g, ' ').trim()}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                    <span className="font-medium">{formatDateEn(featured.publishedAt)}</span>
                    {featured.source && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-600">{featured.source}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-auto inline-flex items-center text-primary-700 font-semibold group-hover:text-primary-800 transition-colors">
                    Read full article 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Latest news */}
          <div className="mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest News</h3>
                <p className="text-gray-600">Stay informed with the most recent industry updates</p>
              </div>
              <Link 
                href="/noticias" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-all duration-200 hover:translate-x-1"
              >
                View all 
                <span className="ml-1">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((n) => (
                <a
                  key={`${n.url}-${n.publishedAt}`}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden relative">
                    {n.imageUrl && n.imageUrl.trim() ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          key={n.imageUrl}
                          src={n.imageUrl}
                          alt={n.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              target.style.display = 'none';
                              const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                              if (placeholder) placeholder.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="image-placeholder text-gray-400 text-center p-4 absolute inset-0 items-center justify-center bg-gray-100" style={{ display: 'none' }}>
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
                    {n.category && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 text-xs font-semibold shadow-md">
                          {normalizeCategory(n.category) === 'agriculture'
                            ? 'Agriculture'
                            : normalizeCategory(n.category) === 'tractors'
                              ? 'Tractors'
                              : 'Industry'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                      {formatDateEn(n.publishedAt)}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
                      {n.title}
                    </h4>
                    {n.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {n.excerpt.replace(/&nbsp;&nbsp;/g, ' ').trim()}
                      </p>
                    )}
                    <div className="mt-4 text-primary-600 text-sm font-semibold group-hover:text-primary-700 transition-colors">
                      Read more →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* All News Grid - Solo en página completa */}
          {showAll && (
            <div className="mt-20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All News</h3>
                  <p className="text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, sectorItems.length)} of {sectorItems.length} news articles
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentPage === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 shadow-md hover:shadow-lg'
                  }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Page</span>
                  <span className="text-lg font-bold text-gray-900">{currentPage + 1}</span>
                  <span className="text-sm text-gray-600">of</span>
                  <span className="text-lg font-bold text-gray-900">{totalPages}</span>
                </div>
                
                <button
                  onClick={goToNext}
                  disabled={currentPage >= totalPages - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentPage >= totalPages - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 shadow-md hover:shadow-lg'
                  }`}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* News Grid with Animation */}
              <div className="relative overflow-hidden">
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out"
                  style={{
                    transform: `translateX(0)`,
                  }}
                >
                  {currentItems.map((n, index) => (
                    <a
                      key={`${n.url}-${n.publishedAt}`}
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                    <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden relative">
                      {n.imageUrl && n.imageUrl.trim() ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={n.imageUrl}
                            alt={n.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                target.style.display = 'none';
                                const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="image-placeholder text-gray-400 text-center p-4 absolute inset-0 items-center justify-center bg-gray-100" style={{ display: 'none' }}>
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
                      {n.category && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 text-xs font-semibold shadow-md">
                            {normalizeCategory(n.category) === 'agriculture'
                              ? 'Agriculture'
                              : normalizeCategory(n.category) === 'tractors'
                                ? 'Tractors'
                                : 'Industry'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                        {formatDateEn(n.publishedAt)}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
                        {n.title}
                      </h4>
                      {n.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {n.excerpt.replace(/&nbsp;&nbsp;/g, ' ').trim()}
                        </p>
                      )}
                      <div className="mt-4 text-primary-600 text-sm font-semibold group-hover:text-primary-700 transition-colors">
                        Read more →
                      </div>
                    </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

