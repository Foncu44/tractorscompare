'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { getBrandColor } from '@/lib/brandLogos';
import { loadTractors, loadBrandBySlug, brandToSlug } from '@/lib/tractorsLoader';

interface TractorsByBrandProps {
  type?: 'farm' | 'lawn' | 'all';
}

const ITEMS_PER_PAGE = 24; // Tractors per page

export default function TractorsByBrand({ type = 'all' }: TractorsByBrandProps) {
  const searchParams = useSearchParams();
  const selectedBrandSlug = searchParams.get('marca');
  
  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayTractors, setDisplayTractors] = useState<any[]>([]);
  const [tractors, setTractors] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Load tractor data asynchronously - Optimized to avoid blocking
  useEffect(() => {
    let mounted = true;
    
    function loadData() {
      setIsLoading(true);
      
      // Use requestIdleCallback to avoid blocking main thread
      const loadAsync = () => {
        Promise.all([
          loadTractors(),
          selectedBrandSlug ? loadBrandBySlug(selectedBrandSlug) : Promise.resolve(null)
        ]).then(([tractorsData, brand]) => {
          if (mounted) {
            setTractors(tractorsData);
            setSelectedBrand(brand || null);
            setIsLoading(false);
          }
        }).catch((error) => {
          console.error('Error loading tractors:', error);
          if (mounted) {
            setIsLoading(false);
          }
        });
      };
      
      // Defer load if browser is busy
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(loadAsync, { timeout: 500 });
      } else {
        // Fallback: small delay to avoid blocking
        setTimeout(loadAsync, 50);
      }
    }
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [selectedBrandSlug]);

  // Memoize tractor filtering for better performance
  // Use chunking to avoid blocking main thread with large arrays
  const filteredTractors = useMemo(() => {
    if (tractors.length === 0) return [];
    
    let filtered = tractors;

    // Filter by type
    if (type !== 'all') {
      filtered = filtered.filter(t => (t.type || 'farm') === type);
    }

    // Filter by brand if selected
    if (selectedBrand) {
      filtered = filtered.filter(t => t.brand === selectedBrand);
    }

    // Sort by brand and model - Use stable sort for better performance
    return filtered.sort((a, b) => {
      const brandCompare = a.brand.localeCompare(b.brand);
      if (brandCompare !== 0) return brandCompare;
      return a.model.localeCompare(b.model);
    });
  }, [tractors, selectedBrand, type]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTractors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // Tractors to display (paginated)
  const tractorsToShow = useMemo(() => {
    return filteredTractors.slice(startIndex, endIndex);
  }, [filteredTractors, startIndex, endIndex]);

  // Effect to reset page when brand or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, type]);

  // Effect to update tractors when filters or page change
  // Use requestIdleCallback to avoid blocking main thread
  useEffect(() => {
    // If first render, set without animation
    if (displayTractors.length === 0) {
      setDisplayTractors(tractorsToShow);
      return;
    }

    // If there's a change, animate using requestIdleCallback to avoid blocking
    setIsLoading(true);
    
    const scheduleUpdate = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setDisplayTractors(tractorsToShow);
          setTimeout(() => {
            setIsLoading(false);
          }, 50);
        }, { timeout: 200 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          setDisplayTractors(tractorsToShow);
          setTimeout(() => {
            setIsLoading(false);
          }, 50);
        }, 200);
      }
    };
    
    scheduleUpdate();
  }, [tractorsToShow, displayTractors.length]);

  // Function to change page
  const goToPage = (page: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsLoading(true);
      setCurrentPage(page);
      
      // Smooth scroll only to tractor container, not to top
      setTimeout(() => {
        const gridElement = document.querySelector('[data-tractor-grid]');
        if (gridElement) {
          gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum visible page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic to show pages with ellipsis
      if (currentPage <= 3) {
        // At the beginning
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // At the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const powerHP = (tractor: typeof tractors[0]) => 
    tractor.engine?.powerHP || tractor.engine?.powerKW ? 
      Math.round((tractor.engine.powerHP || (tractor.engine.powerKW || 0) * 1.341)) : null;

  if (displayTractors.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <p className="text-gray-600 text-lg">
          {selectedBrand 
            ? `No tractors found for brand "${selectedBrand}"`
            : 'No tractors found'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {selectedBrand ? `${selectedBrand} Tractors` : 'All Tractors'}
        </h2>
        <p className="text-gray-600">
          {filteredTractors.length} {filteredTractors.length === 1 ? 'tractor found' : 'tractors found'}
          {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
        </p>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading tractors...</p>
          </div>
        </div>
      )}

      {/* Tractor grid with animation */}
      <div 
        data-tractor-grid
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {tractorsToShow.map((tractor, index) => {
          const slug = tractor.slug || `${brandToSlug(tractor.brand)}-${tractor.model.toLowerCase().replace(/\s+/g, '-')}`;
          const hp = powerHP(tractor);
          const brandColor = getBrandColor(tractor.brand);

          return (
            <Link
              key={slug}
              href={`/tractores/${slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Imagen */}
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {tractor.imageUrl ? (
                  <img
                    src={tractor.imageUrl}
                    alt={`${tractor.brand} ${tractor.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${brandColor} p-6`}>
                    <BrandLogo
                      brandName={tractor.brand}
                      width={120}
                      height={80}
                      className="opacity-80"
                    />
                  </div>
                )}
                
                {/* Type badge */}
                {tractor.type && (
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tractor.type === 'farm' 
                        ? 'bg-green-600 text-white' 
                        : tractor.type === 'lawn'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {tractor.type === 'farm' ? 'Agricultural' : tractor.type === 'lawn' ? 'Lawn' : tractor.type}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                  {tractor.brand}
                </p>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {tractor.model}
                </h3>
                
                {/* Specifications */}
                <div className="space-y-1 mb-3">
                  {hp && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{hp}</span> HP
                    </p>
                  )}
                  {tractor.engine?.displacement && (
                    <p className="text-xs text-gray-600">
                      {tractor.engine.displacement}L
                    </p>
                  )}
                </div>

                {/* View more */}
                <div className="text-primary-600 text-sm font-semibold group-hover:text-primary-700 transition-colors">
                  View details →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Pagination information */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> -{' '}
            <span className="font-semibold text-gray-900">
              {Math.min(endIndex, filteredTractors.length)}
            </span>{' '}
            of <span className="font-semibold text-gray-900">{filteredTractors.length}</span> tractors
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Previous Button */}
            <button
              onClick={(e) => goToPage(currentPage - 1, e)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-primary-300'
              }`}
            >
              ← Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                
                const pageNum = page as number;
                const isActive = pageNum === currentPage;
                
                return (
                  <button
                    key={pageNum}
                    onClick={(e) => goToPage(pageNum, e)}
                    className={`min-w-[40px] px-3 py-2 rounded-lg border font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-primary-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={(e) => goToPage(currentPage + 1, e)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-primary-300'
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

