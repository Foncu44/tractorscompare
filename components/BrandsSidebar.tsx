'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { loadTractors, brandToSlug } from '@/lib/tractorsLoader';

interface BrandsSidebarProps {
  type?: 'farm' | 'lawn' | 'all';
}

export default function BrandsSidebar({ type = 'all' }: BrandsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedBrand = searchParams.get('marca') || null;
  const [searchQuery, setSearchQuery] = useState('');
  const [tractors, setTractors] = useState<any[]>([]);

  // Cargar datos de tractores de forma asíncrona - Defer para no bloquear
  useEffect(() => {
    // Usar requestIdleCallback para cargar cuando el navegador esté libre
    const loadData = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          loadTractors().then(setTractors).catch(console.error);
        }, { timeout: 1000 });
      } else {
        // Fallback: usar setTimeout para no bloquear
        setTimeout(() => {
          loadTractors().then(setTractors).catch(console.error);
        }, 100);
      }
    };
    
    loadData();
  }, []);

  // Count tractors by brand - Optimized for large arrays
  const brandCounts = useMemo(() => {
    if (tractors.length === 0) return new Map<string, number>();
    
    const counts = new Map<string, number>();
    
    // Process in chunks to avoid blocking main thread with very large arrays
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < tractors.length; i += CHUNK_SIZE) {
      const chunk = tractors.slice(i, i + CHUNK_SIZE);
      for (const tractor of chunk) {
        const tractorType = tractor.type || 'farm';
        
        // Filter by type if necessary
        if (type === 'all' || tractorType === type) {
          const count = counts.get(tractor.brand) || 0;
          counts.set(tractor.brand, count + 1);
        }
      }
    }
    
    return counts;
  }, [tractors, type]);

  // Convert to array, filter by search and sort alphabetically
  const brands = useMemo(() => {
    let brandList = Array.from(brandCounts.entries())
      .map(([brand, count]) => ({
        brand,
        count,
        slug: brandToSlug(brand),
      }));

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      brandList = brandList.filter(({ brand }) => 
        brand.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically
    return brandList.sort((a, b) => a.brand.localeCompare(b.brand));
  }, [brandCounts, searchQuery]);

  const totalTractors = useMemo(() => {
    return Array.from(brandCounts.values()).reduce((sum, count) => sum + count, 0);
  }, [brandCounts]);

  // Construir URL con parámetros
  const buildUrl = (brandSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brandSlug) {
      params.set('marca', brandSlug);
    } else {
      params.delete('marca');
    }
    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ''}`;
  };

  // Manejar cambio de marca sin scroll
  const handleBrandChange = (e: React.MouseEvent<HTMLAnchorElement>, brandSlug: string | null) => {
    e.preventDefault();
    const url = buildUrl(brandSlug);
    // Usar router.push con scroll: false para mantener la posición
    router.push(url, { scroll: false });
  };

  return (
    <div className="w-full md:w-64 lg:w-72 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-4">
      {/* Título */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Marcas</h2>
      
      {/* Línea decorativa amarilla */}
      <div className="h-1 bg-yellow-400 mb-4 rounded-full"></div>

      {/* Buscador */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            id="sidebar-brand-search"
            name="brandSearch"
            type="search"
            placeholder="Buscar marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            aria-label="Buscar marca"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* "All brands" Button */}
      <a
        href={buildUrl(null)}
        onClick={(e) => handleBrandChange(e, null)}
        className={`block w-full mb-4 px-4 py-3 rounded-lg font-semibold text-center transition-all duration-200 cursor-pointer ${
          !selectedBrand
            ? 'bg-green-700 text-white shadow-md hover:bg-green-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All brands
      </a>

      {/* Lista de marcas */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {brands.length === 0 ? (
          <div className="text-center py-8 text-gray-600 text-sm">
            {searchQuery ? `No se encontraron marcas que coincidan con "${searchQuery}"` : 'No hay marcas disponibles'}
          </div>
        ) : (
          brands.map(({ brand, count, slug }) => {
          const isSelected = selectedBrand === slug;
          return (
            <a
              key={brand}
              href={buildUrl(slug)}
              onClick={(e) => handleBrandChange(e, slug)}
              className={`block px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{brand}</span>
                <span className={`text-xs ${
                  isSelected ? 'text-primary-600' : 'text-gray-400'
                }`}>
                  ({count})
                </span>
              </div>
            </a>
          );
          })
        )}
      </div>

      {/* Total de tractores */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Total: <span className="font-semibold text-gray-700">{totalTractors.toLocaleString()}</span> tractores
        </p>
      </div>
    </div>
  );
}

