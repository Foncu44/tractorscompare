import Link from 'next/link';
import type { Metadata } from 'next';
import { getBestCategorySlugs, getBestCategoryBySlug } from '@/lib/bestCategories';

export const metadata: Metadata = {
  title: 'Best Tractors by Category | TractorsCompare',
  description:
    'Browse data-driven tractor rankings by use case: loader work, small farms, utility, horsepower bands, transmission type, and more. Each list uses TractorFit™ scoring.',
};

export default function BestHubPage() {
  const slugs = getBestCategorySlugs();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container-custom py-8 md:py-12">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Best Tractors</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Tractors by Category
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl">
          Data-driven rankings by use case, horsepower band, and transmission type. Each list shows the top 20 tractors using our TractorFit™ scoring so rankings are consistent and reproducible. Choose a category below to see the full list, methodology, and stats.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {slugs.map((slug) => {
            const cat = getBestCategoryBySlug(slug);
            if (!cat) return null;
            return (
              <li key={slug}>
                <Link
                  href={`/best/${slug}`}
                  className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{cat.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-gray-600 max-w-3xl">
          <Link href="/methodology" className="text-primary-600 hover:underline">TractorFit™ methodology</Link>
          {' · '}
          <Link href="/tractores" className="text-primary-600 hover:underline">Full tractor database</Link>
        </p>
      </main>
    </div>
  );
}
