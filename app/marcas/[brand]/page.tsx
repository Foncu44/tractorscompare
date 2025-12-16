import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tractor as TractorIcon } from 'lucide-react';
import { getTractorsByBrand } from '@/data/tractors';
import type { Metadata } from 'next';

interface BrandPageProps {
  params: {
    brand: string;
  };
}

export function generateMetadata({ params }: BrandPageProps): Metadata {
  const brandName = params.brand.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const tractors = getTractorsByBrand(brandName);

  if (tractors.length === 0) {
    return {
      title: 'Marca no encontrada',
    };
  }

  return {
    title: `Tractores ${brandName} - Modelos y Especificaciones`,
    description: `Explora todos los modelos de tractores ${brandName}. Especificaciones completas de ${tractors.length} modelos disponibles.`,
    keywords: [`tractores ${brandName}`, brandName.toLowerCase(), 'tractores'],
  };
}

export default function BrandPage({ params }: BrandPageProps) {
  const brandName = params.brand.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const tractors = getTractorsByBrand(brandName);

  if (tractors.length === 0) {
    notFound();
  }

  return (
    <div className="container-custom py-12">
      <nav className="text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary-600">Inicio</Link>
        {' / '}
        <Link href="/marcas" className="hover:text-primary-600">Marcas</Link>
        {' / '}
        <span className="text-gray-900">{brandName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tractores {brandName}</h1>
        <p className="text-gray-600 text-lg">
          {tractors.length} {tractors.length === 1 ? 'modelo disponible' : 'modelos disponibles'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tractors.map((tractor) => (
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
    </div>
  );
}

