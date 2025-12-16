import Link from 'next/link';
import { getAllBrands, getTractorsByBrand } from '@/data/tractors';
import { getBrandColor } from '@/lib/brandLogos';
import BrandLogo from '@/components/BrandLogo';

export const metadata = {
  title: 'Tractor Brands - Complete Brand Database & Tractor Data',
  description: 'Complete list of all tractor brands with detailed tractor data and specifications. Explore John Deere, Kubota, New Holland, Case IH, Massey Ferguson and more. Access brand-specific tractor data.',
  keywords: ['tractor brands', 'tractor data by brand', 'tractor brand database', 'john deere tractor data', 'kubota tractor data', 'new holland tractor data', 'case ih tractor data', 'tractor specifications by brand'],
};

export default function MarcasPage() {
  const brands = getAllBrands();

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Tractor Brands</h1>
        <p className="text-gray-600 text-lg">
          Explore tractors by brand. Find all available models from each manufacturer.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {brands.map((brand) => {
          const brandTractors = getTractorsByBrand(brand);
          const brandColor = getBrandColor(brand);
          
          return (
            <Link
              key={brand}
              href={`/marcas/${brand.toLowerCase().replace(/\s+/g, '-')}`}
              className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
            >
              <div className={`${brandColor} p-6 text-white min-h-[140px] flex flex-col items-center justify-center transition-all group-hover:shadow-lg`}>
                <div className="mb-3 w-20 h-20 flex items-center justify-center bg-white rounded-lg p-2 shadow-md">
                  <BrandLogo
                    brandName={brand}
                    width={80}
                    height={80}
                    className="w-full h-full"
                  />
                </div>
                <div className="text-sm font-semibold text-black mb-1 text-center">
                  {brand}
                </div>
                <div className="text-xs text-white/70">
                  {brandTractors.length} {brandTractors.length === 1 ? 'model' : 'models'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

