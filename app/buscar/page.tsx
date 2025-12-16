import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Tractor as TractorIcon } from 'lucide-react';
import { searchTractors } from '@/data/tractors';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';

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
          Tractor Data Search Results: <span className="text-primary-600">"{query}"</span>
        </h1>
        <p className="text-gray-600">
          {results.length > 0
            ? `Found ${results.length} tractors`
            : 'No results found'}
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
              <div className="w-full mb-4 rounded-lg overflow-hidden">
                <TractorImagePlaceholder
                  brand={tractor.brand}
                  model={tractor.model}
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <TractorIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No results found</h3>
          <p className="text-gray-600 mb-6">
            Try different search terms or explore our tractors.
          </p>
          <Link href="/tractores" className="btn-primary inline-block">
            View All Tractors
          </Link>
        </div>
      )}
    </div>
  );
}

