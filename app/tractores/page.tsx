import Link from 'next/link';
import { Tractor as TractorIcon, Filter } from 'lucide-react';
import { tractors, TractorType } from '@/data/tractors';
import { Tractor } from '@/types/tractor';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';
import { AdInContent, AdList } from '@/components/AdSense';

export const metadata = {
  title: 'Tractor Data Database - All Tractors & Specifications',
  description: 'Complete tractor data database with specifications for all tractors. Search and filter by brand, type, power, and features. Access detailed tractor data and technical specifications.',
  keywords: ['tractor data', 'tractor database', 'tractor specifications', 'all tractors', 'tractor list', 'tractor data database', 'agricultural tractors', 'lawn tractors', 'tractor specs'],
};

interface TractoresPageProps {
  searchParams: {
    tipo?: TractorType;
    marca?: string;
    busqueda?: string;
  };
}

export default function TractoresPage({ searchParams }: TractoresPageProps) {
  let filteredTractors: Tractor[] = tractors;

  // Filtrar por tipo
  if (searchParams.tipo) {
    const tipoLower = searchParams.tipo.toLowerCase();
    filteredTractors = filteredTractors.filter(t => {
      const tractorType = (t.type || 'farm').toLowerCase();
      return tractorType === tipoLower;
    });
  }

  // Filtrar por marca
  if (searchParams.marca) {
    filteredTractors = filteredTractors.filter(
      t => t.brand.toLowerCase().includes(searchParams.marca!.toLowerCase())
    );
  }

  // Filtrar por búsqueda
  if (searchParams.busqueda) {
    const query = searchParams.busqueda.toLowerCase();
    filteredTractors = filteredTractors.filter(
      t => t.brand.toLowerCase().includes(query) ||
           t.model.toLowerCase().includes(query) ||
           `${t.brand} ${t.model}`.toLowerCase().includes(query)
    );
  }

  const types: { value: TractorType; label: string }[] = [
    { value: 'farm', label: 'Agricultural' },
    { value: 'lawn', label: 'Lawn' },
    { value: 'industrial', label: 'Industrial' },
  ];

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Complete Tractor Data Database</h1>
        <p className="text-gray-600 text-lg">
          Access comprehensive tractor data and specifications for {tractors.length}+ tractors. Search, filter, and compare detailed technical information, engine specs, dimensions, and performance data for all major tractor brands.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h2 className="text-xl font-semibold">Filters</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-2">
              <Link
                href="/tractores"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !searchParams.tipo
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </Link>
              {types.map((type) => (
                <Link
                  key={type.value}
                  href={`/tractores?tipo=${type.value}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    searchParams.tipo === type.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <strong>{filteredTractors.length}</strong> tractors
        </p>
      </div>

      <AdInContent />
      
      {/* Tractors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTractors.map((tractor, index) => (
          <div key={tractor.id}>
            {index === Math.floor(filteredTractors.length / 2) && (
              <div className="col-span-full mb-6">
                <AdList />
              </div>
            )}
            <Link
              href={`/tractores/${tractor.slug}`}
              className="card p-6 hover:scale-105 transition-transform block"
            >
            <div className="w-full mb-4 rounded-lg overflow-hidden">
              <TractorImagePlaceholder
                brand={tractor.brand}
                model={tractor.model}
                imageUrl={tractor.imageUrl}
                width={400}
                height={300}
                className="w-full h-48 rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary-600">{tractor.brand}</span>
              {tractor.year && (
                <span className="text-sm text-gray-500">{tractor.year}</span>
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">{tractor.model}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center">
                <TractorIcon className="w-4 h-4 mr-1" />
                {tractor.engine.powerHP} HP
              </span>
              {tractor.weight && (
                <span>{Math.round(tractor.weight / 1000)} ton</span>
              )}
            </div>
            {tractor.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{tractor.description}</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-xs text-primary-600 font-semibold">View specifications →</span>
            </div>
          </Link>
          </div>
        ))}
      </div>

      {filteredTractors.length === 0 && (
        <div className="text-center py-12">
          <TractorIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No tractors found with the selected filters.</p>
        </div>
      )}
    </div>
  );
}

