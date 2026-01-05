'use client';

import Link from 'next/link';
import { TrendingUp, Eye, Star as StarIcon, ArrowRight } from 'lucide-react';
import { Tractor } from '@/types/tractor';
import BrandLogo from './BrandLogo';
import { brandToSlug } from '@/data/tractors';

interface PopularTractorsSectionProps {
  tractors: Tractor[];
}

export default function PopularTractorsSection({ tractors }: PopularTractorsSectionProps) {
  if (tractors.length === 0) return null;

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
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Los Más Populares</h2>
          </div>
        </div>

        <div className="space-y-3">
          {tractors.slice(0, 5).map((tractor, index) => {
            const slug = tractor.slug || `${brandToSlug(tractor.brand)}-${tractor.model.toLowerCase().replace(/\s+/g, '-')}`;
            const powerHP = tractor.engine?.powerHP || 0;
            const views = getViews(index);
            const rating = getRating(index);

            return (
              <Link
                key={tractor.id}
                href={`/tractores/${slug}`}
                className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex items-center gap-4"
              >
                {/* Número de ranking */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{index + 1}</span>
                </div>

                {/* Imagen miniatura */}
                <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
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
                      width={60} 
                      height={40}
                      className="opacity-50"
                    />
                  )}
                </div>

                {/* Información del tractor */}
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    {tractor.brand}
                  </p>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors truncate">
                    {tractor.brand} {tractor.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {powerHP} CV
                  </p>
                </div>

                {/* Métricas */}
                <div className="flex-shrink-0 flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarIcon className="w-4 h-4 fill-yellow-500" />
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

