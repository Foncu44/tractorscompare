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

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Complete Tractor Database by Category
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              TractorsCompare provides comprehensive tractor data organized by category, making it easy to explore tractors based on their primary use and application. Our database includes agricultural tractors designed for farming operations, lawn tractors for residential and commercial lawn care, and industrial tractors for specialized commercial applications.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Agricultural Tractors
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Agricultural tractors are designed for farming operations and typically feature higher horsepower engines (ranging from 40 to 500+ HP), robust transmissions with multiple gear options, heavy-duty hydraulic systems with high flow rates and lift capacities, and powerful PTO systems. These tractors are built for demanding agricultural tasks including tillage, planting, harvesting, and material handling. Categories within agricultural tractors include compact tractors (20-60 HP) for small farms and properties, utility tractors (60-150 HP) for medium-scale operations, and large agricultural tractors (150+ HP) for extensive farming operations.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Lawn and Garden Tractors
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Lawn and garden tractors are designed for residential and commercial lawn care, property maintenance, and light-duty landscaping tasks. These machines typically feature smaller engines (15-30 HP), hydrostatic transmissions for smooth operation, efficient mowing decks, comfortable operator stations, and simplified controls. They combine performance with ease of use, making them ideal for homeowners, landscapers, and property management companies. Categories include lawn tractors for general mowing and light-duty tasks, garden tractors for more demanding property maintenance, and riding mowers for professional and residential lawn care.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Browse our category pages to explore tractors by type, compare specifications across similar models, and identify the best tractor for your specific needs. Each category provides detailed information about typical specifications, applications, and selection criteria to help you make informed decisions about tractor purchase and operation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

