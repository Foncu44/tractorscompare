import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Tractor as TractorIcon } from 'lucide-react';
import { getTractorsByBrand } from '@/data/tractors';
import type { Metadata } from 'next';
import TractorImagePlaceholder from '@/components/TractorImagePlaceholder';

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
      title: 'Brand not found',
    };
  }

  return {
    title: `${brandName} Tractor Data - All Models & Complete Specifications`,
    description: `Complete ${brandName} tractor data and specifications database. Access detailed technical information for all ${tractors.length} ${brandName} tractor models. Compare specs, find tractor data, and get comprehensive specifications.`,
    keywords: [
      `${brandName.toLowerCase()} tractor data`,
      `${brandName.toLowerCase()} tractor specifications`,
      `${brandName.toLowerCase()} tractor database`,
      `${brandName.toLowerCase()} tractor specs`,
      `${brandName.toLowerCase()} tractors`,
      'tractor data',
      'tractor specifications',
      brandName.toLowerCase(),
    ],
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
        <Link href="/" className="hover:text-primary-600">Home</Link>
        {' / '}
        <Link href="/marcas" className="hover:text-primary-600">Brands</Link>
        {' / '}
        <span className="text-gray-900">{brandName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{brandName} Tractor Data & Specifications</h1>
        <p className="text-gray-600 text-lg">
          Complete {brandName} tractor data database with detailed specifications for {tractors.length} {tractors.length === 1 ? 'model' : 'models'}. Access comprehensive technical information, engine specs, dimensions, and performance data for all {brandName} tractors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tractors.map((tractor) => (
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
    </div>
  );
}

