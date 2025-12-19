import Link from 'next/link';
import { Filter, Search } from 'lucide-react';
import { brandToSlug, getAllBrands, tractors } from '@/data/tractors';
import { getBrandColor } from '@/lib/brandLogos';

export const metadata = {
  title: 'Lawn Tractors - Brands & models',
  description: 'Browse lawn tractor and mower specifications by brand. Filter and sort brands to access models and spec sheets.',
};

export const dynamic = 'force-static';

interface PageProps {
  searchParams?: {
    q?: string;
    sort?: 'name' | 'models';
  };
}

export default function TractoresJardinPage({ searchParams = {} }: PageProps) {
  const q = (searchParams.q || '').trim().toLowerCase();
  const sort = searchParams.sort || 'name';

  const lawnTractors = tractors.filter((t) => (t.type || 'farm') === 'lawn');

  // Conteo por marca (solo jardín)
  const counts = new Map<string, number>();
  for (const t of lawnTractors) {
    counts.set(t.brand, (counts.get(t.brand) || 0) + 1);
  }

  const allBrands = getAllBrands();
  const brands = allBrands
    .map((brand) => ({
      brand,
      slug: brandToSlug(brand),
      count: counts.get(brand) || 0,
      color: getBrandColor(brand),
    }))
    .filter((b) => b.count > 0)
    .filter((b) => !q || b.brand.toLowerCase().includes(q))
    .sort((a, b) => {
      if (sort === 'models') return b.count - a.count;
      return a.brand.localeCompare(b.brand);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Lawn Tractors</h1>
          <p className="text-white/80 text-lg max-w-3xl">
            Find specifications for {lawnTractors.length.toLocaleString()} lawn tractors and mowers from {brands.length} brands.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white py-4">
        <div className="container-custom">
          <form className="flex flex-col sm:flex-row gap-4 items-center justify-between" action="/tractores-jardin" method="GET">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="q"
                defaultValue={searchParams.q || ''}
                placeholder="Search brand..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                name="sort"
                defaultValue={sort}
                className="w-full sm:w-56 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:outline-none bg-white"
              >
                <option value="name">Name A-Z</option>
                <option value="models">Most models</option>
              </select>
              <button className="btn-primary py-2 px-5" type="submit">Apply</button>
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
            {brands.map(({ brand, slug, count, color }) => (
              <Link
                key={brand}
                href={`/marcas/${slug}?tipo=lawn`}
                className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                <div className={`aspect-[4/3] ${color} rounded-lg mb-3 flex items-center justify-center overflow-hidden`}>
                  <div className="text-white text-2xl font-bold px-3 text-center leading-tight">
                    {brand}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {brand}
                </h3>
                <p className="text-sm text-gray-500">{count} models</p>
              </Link>
            ))}
          </div>

          {brands.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No brands found matching &quot;{searchParams.q}&quot;.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

