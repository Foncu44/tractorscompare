'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { tractors, brandToSlug, getBrandBySlug } from '@/data/tractors';
import BrandLogo from '@/components/BrandLogo';
import { getBrandColor } from '@/lib/brandLogos';

interface TractorsByBrandProps {
  type?: 'farm' | 'lawn' | 'all';
}

export default function TractorsByBrand({ type = 'all' }: TractorsByBrandProps) {
  const searchParams = useSearchParams();
  const selectedBrandSlug = searchParams.get('marca');
  const selectedBrand = selectedBrandSlug ? getBrandBySlug(selectedBrandSlug) : null;
  
  // Estado para animación
  const [isLoading, setIsLoading] = useState(false);
  const [displayTractors, setDisplayTractors] = useState<any[]>([]);

  // Función para filtrar tractores
  const filterTractors = () => {
    let filteredTractors = tractors;

    // Filtrar por tipo
    if (type !== 'all') {
      filteredTractors = filteredTractors.filter(t => (t.type || 'farm') === type);
    }

    // Filtrar por marca si está seleccionada
    if (selectedBrand) {
      filteredTractors = filteredTractors.filter(t => t.brand === selectedBrand);
    }

    // Ordenar por marca y modelo
    return filteredTractors.sort((a, b) => {
      if (a.brand !== b.brand) {
        return a.brand.localeCompare(b.brand);
      }
      return a.model.localeCompare(b.model);
    });
  };

  // Efecto para manejar cambios de marca con animación
  useEffect(() => {
    const filtered = filterTractors();
    
    // Si es el primer render, establecer sin animación
    if (displayTractors.length === 0) {
      setDisplayTractors(filtered);
      return;
    }

    // Si hay cambio, animar
    setIsLoading(true);
    
    // Animación de fade out
    setTimeout(() => {
      setDisplayTractors(filtered);
      // Animación de fade in
      setTimeout(() => {
        setIsLoading(false);
      }, 50);
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, type]);

  const powerHP = (tractor: typeof tractors[0]) => 
    tractor.engine?.powerHP || tractor.engine?.powerKW ? 
      Math.round((tractor.engine.powerHP || (tractor.engine.powerKW || 0) * 1.341)) : null;

  if (displayTractors.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <p className="text-gray-600 text-lg">
          {selectedBrand 
            ? `No se encontraron tractores para la marca "${selectedBrand}"`
            : 'No se encontraron tractores'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {selectedBrand ? `Tractores ${selectedBrand}` : 'Todos los Tractores'}
        </h2>
        <p className="text-gray-600">
          {displayTractors.length} {displayTractors.length === 1 ? 'tractor encontrado' : 'tractores encontrados'}
        </p>
      </div>

      {/* Overlay de carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Cargando tractores...</p>
          </div>
        </div>
      )}

      {/* Grid de tractores con animación */}
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {displayTractors.map((tractor, index) => {
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
                
                {/* Badge de tipo */}
                {tractor.type && (
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tractor.type === 'farm' 
                        ? 'bg-green-600 text-white' 
                        : tractor.type === 'lawn'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}>
                      {tractor.type === 'farm' ? 'Agrícola' : tractor.type === 'lawn' ? 'Jardín' : tractor.type}
                    </span>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  {tractor.brand}
                </p>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {tractor.model}
                </h3>
                
                {/* Especificaciones */}
                <div className="space-y-1 mb-3">
                  {hp && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">{hp}</span> CV
                    </p>
                  )}
                  {tractor.engine?.displacementL && (
                    <p className="text-xs text-gray-500">
                      {tractor.engine.displacementL}L
                    </p>
                  )}
                </div>

                {/* Ver más */}
                <div className="text-primary-600 text-sm font-semibold group-hover:text-primary-700 transition-colors">
                  Ver detalles →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

