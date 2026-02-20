import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Choosing the Right Tractor Size | TractorsCompare',
  description: 'Determine the right tractor size based on your property size, tasks, and power requirements. Compare compact, utility, and large tractors.',
};

export const dynamic = 'force-static';

export default function ChoosingTractorSizeGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-primary-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Choosing the Right Tractor Size</span>
          </nav>
        </div>
      </div>

      <article className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Guides
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <span>Buying Guide</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choosing the Right Tractor Size
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Determine the right tractor size based on your property size, tasks, and power requirements. Compare compact, utility, and large tractors.
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                Selecting the right tractor size is one of the most important decisions when buying equipment. Too small and you will be underpowered; too large and you pay more in purchase price, fuel, and maintenance without gaining benefit. This guide helps you match tractor size to your acreage, tasks, and budget.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Compact Tractors (roughly 20–50 HP)</h2>
              <p className="leading-relaxed">
                Compact tractors suit small properties, large gardens, landscaping, and light fieldwork. They are maneuverable, easier to store and transport, and typically have lower running costs. Use them for mowing, tilling small plots, loader work with light loads, and running mid-size implements. If your property is under 10–20 acres and you are not doing heavy tillage or large round bales, a compact is often the right choice.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Utility Tractors (roughly 50–100 HP)</h2>
              <p className="leading-relaxed">
                Utility or mid-size tractors handle mixed farming, hay work, larger loaders, and more demanding implements. They offer a balance of power, size, and versatility. Consider this range for 20–100 acres, livestock operations, haying, and general fieldwork where you need more PTO power and hydraulic capacity than a compact can provide.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Large Agricultural Tractors (100+ HP)</h2>
              <p className="leading-relaxed">
                High-horsepower tractors are built for large-scale row crop and grain farming, heavy tillage, big balers, and high-capacity planting and harvesting. They require more space, stronger trailers for transport, and higher fuel and maintenance budgets. Match this size to your acreage and implement list; our database lets you filter by horsepower to compare specs across categories.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Matching Tasks to Size</h2>
              <p className="leading-relaxed">
                List your main tasks: mowing, tilling, loader work, PTO-driven implements (mowers, tillers, balers), and drawbar work. Check the horsepower and PTO requirements of the implements you use or plan to buy. Your tractor should meet or slightly exceed those requirements for reliable operation. Use TractorsCompare to filter by engine HP, PTO HP, and hydraulic flow to find models that fit your needs.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Guides
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
