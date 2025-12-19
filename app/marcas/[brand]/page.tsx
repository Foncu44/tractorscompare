import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Filter, Search, Tractor as TractorIcon } from 'lucide-react';
import { brandToSlug, getBrandBySlug, getTractorsByBrand, getAllBrands } from '@/data/tractors';
import type { Metadata } from 'next';
import type { TractorType } from '@/types/tractor';
import { getBrandLogo } from '@/lib/brandLogos';

interface BrandPageProps {
  params: {
    brand: string;
  };
  searchParams?: {
    q?: string;
    tipo?: TractorType;
    sort?: 'model' | 'power' | 'year';
    page?: string;
  };
}

const PAGE_SIZE = 50;

function buildBrandHref(brandSlug: string, params: { q?: string; tipo?: TractorType; sort?: string; page?: number }): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.tipo) sp.set('tipo', params.tipo);
  if (params.sort && params.sort !== 'model') sp.set('sort', params.sort);
  if (params.page && params.page > 1) sp.set('page', String(params.page));
  const qs = sp.toString();
  return qs ? `/marcas/${brandSlug}?${qs}` : `/marcas/${brandSlug}`;
}

// Generar parámetros estáticos para export estático
export async function generateStaticParams() {
  const brands = getAllBrands();
  return brands.map((brand) => ({
    brand: brandToSlug(brand),
  }));
}

export function generateMetadata({ params }: BrandPageProps): Metadata {
  const brandName = getBrandBySlug(params.brand);
  if (!brandName) {
    return { title: 'Brand not found' };
  }

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

// Forzar renderizado estático (evita errores con searchParams)
export const dynamic = 'force-static';

export default function BrandPage({ params, searchParams }: BrandPageProps) {
  const brandName = getBrandBySlug(params.brand);
  if (!brandName) {
    notFound();
  }

  const allBrandTractors = getTractorsByBrand(brandName);

  if (allBrandTractors.length === 0) {
    notFound();
  }

  const sp = searchParams || {};
  const q = (sp.q || '').trim().toLowerCase();
  const tipo = sp.tipo;
  const sort = sp.sort || 'model';
  const requestedPage = Math.max(1, Number.parseInt(sp.page || '1', 10) || 1);

  const typeLabels: Record<TractorType, string> = {
    farm: 'Agricultural',
    lawn: 'Lawn',
    industrial: 'Industrial',
  };

  // Stats (sobre el total de la marca)
  const uniqueTypes = Array.from(new Set(allBrandTractors.map(t => (t.type || 'farm') as TractorType)));
  const hpValues = allBrandTractors.map(t => t.engine?.powerHP || 0).filter(hp => hp > 0);
  const minHP = hpValues.length ? Math.min(...hpValues) : 0;
  const maxHP = hpValues.length ? Math.max(...hpValues) : 0;
  const brandLogo = getBrandLogo(brandName);

  // Filtrar + ordenar (server-side)
  let filtered = allBrandTractors;
  if (tipo) {
    filtered = filtered.filter(t => (t.type || 'farm') === tipo);
  }
  if (q) {
    filtered = filtered.filter(t =>
      t.model.toLowerCase().includes(q) ||
      `${t.brand} ${t.model}`.toLowerCase().includes(q)
    );
  }
  filtered = filtered.slice().sort((a, b) => {
    if (sort === 'power') return (b.engine.powerHP || 0) - (a.engine.powerHP || 0);
    if (sort === 'year') return (b.year || 0) - (a.year || 0);
    return a.model.localeCompare(b.model);
  });

  // Paginación
  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalResults);
  const pageTractors = filtered.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-100/60 border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-700">Home</Link>
            {' / '}
            <Link href="/marcas" className="hover:text-primary-700">Brands</Link>
            {' / '}
            <span className="text-gray-900">{brandName}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-white py-10 lg:py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-32 h-20 bg-white rounded-xl border border-gray-200 flex items-center justify-center p-4 shadow-sm">
                  {brandLogo ? (
                    <img
                      src={brandLogo}
                      alt={brandName}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-900 text-center">{brandName}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{brandName}</h1>
                  <p className="text-gray-600 mt-1">
                    {allBrandTractors.length} models · {uniqueTypes.length} types
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mb-4">
                Full {brandName} tractor database. Filter by type, search models and access technical specifications.
              </p>

              <Link
                href="/comparar"
                className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Go to comparison tool</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                <TractorIcon className="h-8 w-8 text-primary-700 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{allBrandTractors.length}</p>
                <p className="text-sm text-gray-600">Models</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                <Filter className="h-8 w-8 text-primary-700 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">{uniqueTypes.length}</p>
                <p className="text-sm text-gray-600">Types</p>
              </div>
              <div className="col-span-2 bg-primary-50 rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Power range</p>
                <p className="text-2xl font-bold text-gray-900">
                  {minHP && maxHP ? `${minHP} - ${maxHP} HP` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="container-custom">
          <form className="flex flex-col md:flex-row gap-4" action={`/marcas/${params.brand}`} method="GET">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="q"
                defaultValue={sp.q || ''}
                placeholder="Search model..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            <select
              name="tipo"
              defaultValue={tipo || ''}
              className="w-full md:w-[200px] px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">All types</option>
              <option value="farm">Agricultural</option>
              <option value="lawn">Lawn</option>
              <option value="industrial">Industrial</option>
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="w-full md:w-[200px] px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="model">Sort: Model</option>
              <option value="power">Sort: Power</option>
              <option value="year">Sort: Year</option>
            </select>

            <button className="btn-primary py-2 px-5" type="submit">
              Apply
            </button>

            {(q || tipo || (sort && sort !== 'model') || page > 1) && (
              <Link
                href={`/marcas/${params.brand}`}
                className="btn-secondary py-2 px-5 text-center"
              >
                Clear
              </Link>
            )}
          </form>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <p>
              Showing <strong className="text-gray-900">{totalResults}</strong> results
              {totalResults > 0 && (
                <>
                  {' '}· page <strong className="text-gray-900">{page}</strong> / <strong className="text-gray-900">{totalPages}</strong> ({startIndex + 1}–{endIndex})
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="py-10">
        <div className="container-custom">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold text-gray-900">Model</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Power</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 hidden md:table-cell">Engine</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 hidden lg:table-cell">Transmission</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 hidden lg:table-cell">Type</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 hidden xl:table-cell">Year</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 text-right">Spec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageTractors.map((tractor) => (
                    <tr key={tractor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/tractores/${tractor.slug}`}
                          className="font-semibold text-gray-900 hover:text-primary-700 transition-colors"
                        >
                          {tractor.model}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary-700">{tractor.engine.powerHP} HP</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                        {tractor.engine.cylinders ? `${tractor.engine.cylinders} cyl` : '—'} · {tractor.engine.fuelType}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-600 capitalize">
                        {tractor.transmission?.type || '—'}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-700">
                          {typeLabels[(tractor.type || 'farm') as TractorType]}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-gray-600">
                        {tractor.year || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/tractores/${tractor.slug}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary-50 text-primary-700 font-semibold"
                        >
                          View specs →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalResults === 0 && (
              <div className="text-center py-12">
                <TractorIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-1">No tractors found</p>
                <p className="text-gray-600">Try adjusting the search filters.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalResults > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href={buildBrandHref(params.brand, { q: sp.q, tipo, sort, page: Math.max(1, page - 1) })}
                aria-disabled={page === 1}
                className={`px-4 py-2 rounded-lg border font-medium ${
                  page === 1 ? 'text-gray-400 border-gray-200 pointer-events-none' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                ← Prev
              </Link>
              <span className="text-sm text-gray-600">
                Page <strong className="text-gray-900">{page}</strong> / <strong className="text-gray-900">{totalPages}</strong>
              </span>
              <Link
                href={buildBrandHref(params.brand, { q: sp.q, tipo, sort, page: Math.min(totalPages, page + 1) })}
                aria-disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg border font-medium ${
                  page === totalPages ? 'text-gray-400 border-gray-200 pointer-events-none' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

