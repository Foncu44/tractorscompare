import Link from 'next/link';
import { getAllBrands, getTractorsByBrand } from '@/data/tractors';

export const metadata = {
  title: 'Marcas de Tractores - Todas las Marcas',
  description: 'Explora todas las marcas de tractores disponibles: John Deere, Kubota, New Holland, Case IH, Massey Ferguson y más.',
  keywords: ['marcas tractores', 'john deere', 'kubota', 'new holland', 'case ih'],
};

export default function MarcasPage() {
  const brands = getAllBrands();

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Marcas de Tractores</h1>
        <p className="text-gray-600 text-lg">
          Explora tractores por marca. Encuentra todos los modelos disponibles de cada fabricante.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand) => {
          const brandTractors = getTractorsByBrand(brand);
          return (
            <Link
              key={brand}
              href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-')}`}
              className="card p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl font-bold text-primary-600 mb-3">
                {brand.charAt(0)}
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{brand}</h3>
              <p className="text-sm text-gray-600">
                {brandTractors.length} {brandTractors.length === 1 ? 'modelo' : 'modelos'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

