import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Tractor as TractorIcon } from 'lucide-react';
import { searchTractors } from '@/data/tractors';

interface BuscarPageProps {
  searchParams: {
    q?: string;
  };
}

export default function BuscarPage({ searchParams }: BuscarPageProps) {
  const query = searchParams.q || '';
  
  if (!query) {
    redirect('/');
  }

  const results = searchTractors(query);

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Resultados de búsqueda para: <span className="text-primary-600">"{query}"</span>
        </h1>
        <p className="text-gray-600">
          {results.length > 0
            ? `Se encontraron ${results.length} tractores`
            : 'No se encontraron resultados'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((tractor) => (
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <TractorIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600 mb-6">
            Intenta con otros términos de búsqueda o explora nuestros tractores.
          </p>
          <Link href="/tractores" className="btn-primary inline-block">
            Ver Todos los Tractores
          </Link>
        </div>
      )}
    </div>
  );
}

