'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { Tractor } from '@/types/tractor';
import BrandLogo from './BrandLogo';
import { brandToSlug } from '@/data/tractors';

interface NewTractorsSectionProps {
  tractors: Tractor[];
}

export default function NewTractorsSection({ tractors }: NewTractorsSectionProps) {
  if (tractors.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-primary-600 fill-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Novedades 2025</h2>
          </div>
          <Link 
            href="/tractores-agricolas?year=2025" 
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4 min-w-max">
            {tractors.map((tractor) => {
              const slug = tractor.slug || `${brandToSlug(tractor.brand)}-${tractor.model.toLowerCase().replace(/\s+/g, '-')}`;
              const powerHP = tractor.engine?.powerHP || 0;
              const price = tractor.priceRange?.min || null;

              return (
                <Link
                  key={tractor.id}
                  href={`/tractores/${slug}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 min-w-[280px] max-w-[280px] overflow-hidden"
                >
                  <div className="relative">
                    {/* Badge "Nuevo" */}
                    <div className="absolute top-3 left-3 z-10 bg-primary-600 text-white px-3 py-1 rounded-md text-xs font-semibold">
                      Nuevo
                    </div>
                    
                    {/* Imagen del tractor */}
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      {tractor.imageUrl ? (
                        <img
                          src={tractor.imageUrl}
                          alt={`${tractor.brand} ${tractor.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <BrandLogo 
                            brandName={tractor.brand} 
                            width={120} 
                            height={80}
                            className="opacity-50"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      {tractor.brand}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {tractor.brand} {tractor.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {powerHP} CV
                    </p>
                    {price && (
                      <p className="text-lg font-bold text-primary-600">
                        Desde €{price.toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

