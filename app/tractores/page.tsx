import Link from 'next/link';
import Image from 'next/image';
import { Tractor as TractorIcon, Filter } from 'lucide-react';
import { tractors, TractorType } from '@/data/tractors';
import { Tractor } from '@/types/tractor';

export const metadata = {
  title: 'Todos los Tractores - Especificaciones Completas',
  description: 'Explora nuestra base de datos completa de tractores agrícolas, de jardín e industriales. Filtra por marca, tipo y características.',
  keywords: ['tractores', 'lista tractores', 'tractores agrícolas', 'tractores jardín'],
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
    filteredTractors = filteredTractors.filter(t => t.type === searchParams.tipo);
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
    { value: 'farm', label: 'Agrícolas' },
    { value: 'lawn', label: 'Jardín' },
    { value: 'industrial', label: 'Industriales' },
  ];

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Todos los Tractores</h1>
        <p className="text-gray-600 text-lg">
          Explora nuestra base de datos completa de {tractors.length}+ tractores con especificaciones detalladas.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h2 className="text-xl font-semibold">Filtros</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <div className="flex gap-2">
              {types.map((type) => (
                <Link
                  key={type.value}
                  href={`/tractores${searchParams.tipo === type.value ? '' : `?tipo=${type.value}`}`}
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
          Mostrando <strong>{filteredTractors.length}</strong> tractores
        </p>
      </div>

      {/* Tractors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTractors.map((tractor) => (
          <Link
            key={tractor.id}
            href={`/tractores/${tractor.slug}`}
            className="card p-6 hover:scale-105 transition-transform"
          >
            {tractor.imageUrl && (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={tractor.imageUrl}
                  alt={`${tractor.brand} ${tractor.model}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            )}
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
              <span className="text-xs text-primary-600 font-semibold">Ver especificaciones →</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredTractors.length === 0 && (
        <div className="text-center py-12">
          <TractorIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No se encontraron tractores con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
}

