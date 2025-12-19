import Link from 'next/link';
import { Tractor } from 'lucide-react';

export const metadata = {
  title: 'Tractors - Categories',
  description: 'Browse tractors by category: agricultural or lawn. Explore brands, models and spec sheets.',
  keywords: ['tractors', 'agricultural tractors', 'lawn tractors', 'specifications', 'spec sheet'],
};

// Forzar renderizado estático
export const dynamic = 'force-static';

export default function TractoresPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Tractors</h1>
          <p className="text-white/80 text-lg max-w-3xl">
            Choose a category to explore brands and models with full specifications.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tractores-agricolas"
              className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                  <Tractor className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                  Agricultural Tractors
                </h2>
              </div>
              <p className="text-gray-600">
                Explore agricultural tractor brands and models with full specs.
              </p>
              <div className="mt-4 text-primary-700 font-semibold">View brands →</div>
            </Link>

            <Link
              href="/tractores-jardin"
              className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-700 text-white flex items-center justify-center">
                  <Tractor className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                  Lawn Tractors
                </h2>
              </div>
              <p className="text-gray-600">
                Find mowers and lawn tractors by brand and access spec sheets.
              </p>
              <div className="mt-4 text-primary-700 font-semibold">View brands →</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

