'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import { brandToSlug, getAllBrands, tractors } from '@/data/tractors';
import { getBrandColor } from '@/lib/brandLogos';
import BrandLogo from '@/components/BrandLogo';

export default function TractoresAgricolasPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'name');

  const farmTractors = useMemo(() => tractors.filter((t) => (t.type || 'farm') === 'farm'), []);

  // Conteo por marca (solo agrícola)
  const counts = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const t of farmTractors) {
      countMap.set(t.brand, (countMap.get(t.brand) || 0) + 1);
    }
    return countMap;
  }, [farmTractors]);

  const allBrands = useMemo(() => getAllBrands(), []);

  const brands = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return allBrands
      .map((brand) => ({
        brand,
        slug: brandToSlug(brand),
        count: counts.get(brand) || 0,
        color: getBrandColor(brand),
      }))
      .filter((b) => b.count > 0)
      .filter((b) => !qLower || b.brand.toLowerCase().includes(qLower))
      .sort((a, b) => {
        if (sort === 'models') return b.count - a.count;
        return a.brand.localeCompare(b.brand);
      });
  }, [allBrands, counts, q, sort]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (sort !== 'name') params.set('sort', sort);
    router.push(`/tractores-agricolas${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Agricultural Tractors</h1>
          <p className="text-white/80 text-lg max-w-3xl">
            Find specifications for {farmTractors.length.toLocaleString()} agricultural tractors from {brands.length} brands.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white py-4">
        <div className="container-custom">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search brand..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
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
                href={`/marcas/${slug}?tipo=farm`}
                className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                <div className={`aspect-[4/3] ${color} rounded-lg mb-3 flex items-center justify-center overflow-hidden p-4`}>
                  <div className="w-full h-full flex items-center justify-center">
                    <BrandLogo 
                      brandName={brand} 
                      width={120} 
                      height={80}
                      className="max-w-full max-h-full"
                    />
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
              No brands found matching &quot;{q}&quot;.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

