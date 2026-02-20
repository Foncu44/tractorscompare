'use client';

import Link from 'next/link';
import { TrendingUp, Eye, Star as StarIcon, ArrowRight } from 'lucide-react';
import { Tractor } from '@/types/tractor';
import BrandLogo from './BrandLogo';
import { brandToSlug } from '@/data/tractors';
import { loadTractors } from '@/lib/tractorsLoader';
import { useState, useEffect } from 'react';
import { SkeletonList } from './SkeletonLoader';

interface PopularTractorsSectionProps {
  tractors?: Tractor[]; // Opcional, si no se pasan, se cargan dinámicamente
}

export default function PopularTractorsSection({ tractors: propTractors }: PopularTractorsSectionProps) {
  const [tractors, setTractors] = useState<Tractor[]>(propTractors || []);
  const [isLoading, setIsLoading] = useState(!propTractors);

  // Load tractors if not passed as props - Defer to avoid blocking
  useEffect(() => {
    if (!propTractors) {
      // Use requestIdleCallback to load when browser is idle
      const loadData = () => {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          requestIdleCallback(() => {
            loadTractors().then((data) => {
              setTractors(data);
              setIsLoading(false);
            }).catch(console.error);
          }, { timeout: 1000 });
        } else {
          // Fallback: use setTimeout to avoid blocking
          setTimeout(() => {
            loadTractors().then((data) => {
              setTractors(data);
              setIsLoading(false);
            }).catch(console.error);
          }, 100);
        }
      };
      
      loadData();
    }
  }, [propTractors]);

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900">Most Popular</h2>
            </div>
          </div>
          <SkeletonList count={5} />
        </div>
      </section>
    );
  }

  if (tractors.length === 0) return null;

  // Filter and sort popular tractors
  const popularTractors = tractors
    .filter(t => t.type === 'farm' && (t.engine?.powerHP || 0) > 100)
    .sort((a, b) => {
      const aHasImage = a.imageUrl ? 1 : 0;
      const bHasImage = b.imageUrl ? 1 : 0;
      if (bHasImage !== aHasImage) return bHasImage - aHasImage;
      return (b.engine?.powerHP || 0) - (a.engine?.powerHP || 0);
    })
    .slice(0, 5);

  if (popularTractors.length === 0) return null;

  // Simular vistas y ratings (en producción esto vendría de analytics)
  const getViews = (index: number) => {
    const views = [12500, 9800, 8200, 7500, 6800];
    return views[index] || Math.floor(Math.random() * 5000 + 3000);
  };

  const getRating = (index: number) => {
    const ratings = [4.8, 4.7, 4.9, 4.6, 4.5];
    return ratings[index] || (4.5 + Math.random() * 0.4);
  };

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container-custom">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Most Popular</h2>
          </div>
        </div>

        <div className="space-y-3">
          {popularTractors.map((tractor, index) => {
            const slug = tractor.slug || `${brandToSlug(tractor.brand)}-${tractor.model.toLowerCase().replace(/\s+/g, '-')}`;
            const powerHP = tractor.engine?.powerHP || 0;
            const views = getViews(index);
            const rating = getRating(index);

            return (
              <Link
                key={tractor.id}
                href={`/tractores/${slug}`}
                className="group bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex items-center gap-3 md:gap-4"
              >
                {/* Número de ranking */}
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-base md:text-lg">{index + 1}</span>
                </div>

                {/* Imagen miniatura */}
                <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                  {tractor.imageUrl ? (
                    <img
                      src={tractor.imageUrl}
                      alt={`${tractor.brand} ${tractor.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {(!tractor.imageUrl || !tractor.imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) && (
                    <BrandLogo 
                      brandName={tractor.brand} 
                      width={50} 
                      height={35}
                      className="opacity-50 md:w-[60px] md:h-[40px]"
                    />
                  )}
                </div>

                {/* Tractor information */}
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                    {tractor.brand}
                  </p>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate text-sm md:text-base">
                    {tractor.brand} {tractor.model}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {powerHP} HP
                  </p>
                </div>

                {/* Métricas */}
                <div className="flex-shrink-0 flex items-center gap-2 md:gap-4">
                  <div className="hidden sm:flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs md:text-sm font-medium">
                      {views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarIcon className="w-4 h-4 fill-yellow-500" />
                    <span className="text-xs md:text-sm font-medium">{rating.toFixed(1)}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

