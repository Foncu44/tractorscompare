import Link from 'next/link';
import { brandToSlug, getAllBrands, tractors } from '@/data/tractors';
import { getBrandLogo } from '@/lib/brandLogos';
import { Filter, Search } from 'lucide-react';

export const metadata = {
  title: 'Tractor Brands - Complete Brand Database & Tractor Data',
  description: 'Complete list of all tractor brands with detailed tractor data and specifications. Explore John Deere, Kubota, New Holland, Case IH, Massey Ferguson and more. Access brand-specific tractor data.',
  keywords: ['tractor brands', 'tractor data by brand', 'tractor brand database', 'john deere tractor data', 'kubota tractor data', 'new holland tractor data', 'case ih tractor data', 'tractor specifications by brand'],
};

interface MarcasPageProps {
  searchParams?: Promise<{ q?: string; sort?: 'name' | 'models' }>;
}

// Forzar renderizado estático (evita errores con searchParams)
export const dynamic = 'force-static';

export default async function MarcasPage({ searchParams }: MarcasPageProps) {
  const params = searchParams ? await searchParams : {};
  const q = (params.q || '').trim().toLowerCase();
  const sort = params.sort || 'name';

  // Contar modelos por marca en una sola pasada (evita N filtros sobre 10k tractores)
  const brandCounts = new Map<string, number>();
  for (const t of tractors) {
    brandCounts.set(t.brand, (brandCounts.get(t.brand) || 0) + 1);
  }

  const allBrands = getAllBrands();
  const brands = allBrands
    .filter((b) => !q || b.toLowerCase().includes(q))
    .map((brand) => ({
      brand,
      slug: brandToSlug(brand),
      count: brandCounts.get(brand) || 0,
      logo: getBrandLogo(brand),
    }))
    .sort((a, b) => {
      if (sort === 'models') return b.count - a.count;
      return a.brand.localeCompare(b.brand);
    });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Tractor brands</h1>
          <p className="text-white/80 text-lg max-w-3xl">
            Browse our catalog by manufacturer: {allBrands.length} brands and {tractors.length.toLocaleString()} models.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white py-4">
        <div className="container-custom">
          <form className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between" action="/marcas" method="GET">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="q"
                defaultValue={params.q || ''}
                placeholder="Search brand..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                name="sort"
                defaultValue={sort}
                className="w-full sm:w-56 px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              >
                <option value="name">Name A-Z</option>
                <option value="models">Most models</option>
              </select>
              <button className="btn-primary py-2 px-4" type="submit">Apply</button>
            </div>
          </form>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10">
        <div className="container-custom">
          <div className="mb-6 text-gray-600">
            Showing <strong>{brands.length}</strong> brands
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {brands.map(({ brand, slug, count, logo }) => (
              <Link
                key={brand}
                href={`/marcas/${slug}`}
                className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {logo ? (
                    // Usamos <img> para evitar hidratar componentes client en un grid grande
                    <img
                      src={logo}
                      alt={`${brand} logo`}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center text-gray-700 font-semibold">
                      {brand}
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {brand}
                </h3>
                <p className="text-sm text-gray-500">{count} {count === 1 ? 'model' : 'models'}</p>
              </Link>
            ))}
          </div>

          {brands.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No brands found matching &quot;{params.q}&quot;.
            </div>
          )}
        </div>
      </section>

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Complete Tractor Brand Database
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              TractorsCompare provides comprehensive tractor data for {allBrands.length} major tractor manufacturers, covering over {tractors.length.toLocaleString()} tractor models with detailed technical specifications. Our extensive brand database includes leading manufacturers such as John Deere, Kubota, New Holland, Case IH, Massey Ferguson, Fendt, Claas, Deutz-Fahr, McCormick, Mahindra, Yanmar, Zetor, and many others.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Finding Tractor Information by Brand
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Each brand page provides access to all tractor models from that manufacturer, complete with detailed specifications including engine data, transmission options, PTO specifications, hydraulic systems, dimensions, weight, and performance data. Use our brand pages to filter models by type (agricultural, lawn, industrial), search by model name, sort by power or year, and compare specifications across different models from the same manufacturer.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Brand-specific information helps you understand the unique characteristics and strengths of each manufacturer. Different brands often specialize in specific tractor categories or offer distinct features, transmission options, and technology. Comparing tractors within the same brand can help you identify the best model for your needs, while comparing across brands helps you evaluate different manufacturer approaches and value propositions.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Using Brand Pages for Tractor Selection
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Our brand database enables you to explore tractors systematically by manufacturer, making it easier to research models from specific brands or compare offerings across different manufacturers. Each brand page includes statistics such as total model count, available tractor types, and power range, helping you quickly assess the scope of each manufacturer's product lineup.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Whether you're researching specifications for purchasing decisions, comparing models from different brands, or seeking detailed information about specific manufacturers, our comprehensive brand database provides extensive tractor data to support your research and decision-making process.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

