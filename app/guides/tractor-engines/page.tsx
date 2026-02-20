import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tractor Engine Types Explained | TractorsCompare',
  description: 'Understand diesel vs gasoline engines, horsepower ratings, torque, and engine specifications for different tractor applications.',
};

export const dynamic = 'force-static';

export default function TractorEnginesGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-primary-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Tractor Engine Types Explained</span>
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
              <span>Technical Guide</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tractor Engine Types Explained
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Understand diesel vs gasoline engines, horsepower ratings, torque, and engine specifications for different tractor applications.
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                The engine is the heart of any tractor. Understanding engine types and key specs helps you compare models and choose the right powerplant for your workload. This guide covers fuel types, horsepower, torque, and other engine specifications you will see in our database.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Diesel vs. Gasoline</h2>
              <p className="leading-relaxed">
                Most agricultural and utility tractors use <strong>diesel</strong> engines. Diesel offers better fuel efficiency, higher torque at low RPM, and longer engine life under heavy load, which is why it dominates in farming and construction. <strong>Gasoline</strong> engines are more common on smaller lawn and garden tractors; they start easily in cold weather and are simpler in some respects, but use more fuel and deliver less torque for their size under continuous load.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Horsepower (HP)</h2>
              <p className="leading-relaxed">
                <strong>Gross horsepower</strong> is measured at the engine, usually at a given RPM. <strong>Net horsepower</strong> (or PTO/drawbar HP) is what is available after losses through the transmission and driveline. When comparing tractors, use the same type of rating—typically net or PTO HP—for a fair comparison. Higher HP means more capacity for heavy implements and faster work, but also higher purchase price and fuel consumption.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Torque</h2>
              <p className="leading-relaxed">
                Torque (expressed in Nm or lb-ft) is the twisting force the engine produces. High torque at low RPM helps tractors pull through tough spots without stalling and reduces the need to shift. Diesel engines typically produce more torque at lower RPM than gasoline engines. Torque reserve—the ability to maintain or increase torque as RPM drops briefly—is especially useful in fieldwork.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Displacement, Cylinders, and Aspiration</h2>
              <p className="leading-relaxed">
                <strong>Displacement</strong> (liters or cubic inches) indicates engine size. Larger displacement generally means more power and torque but also more weight and fuel use. <strong>Cylinder count</strong> (e.g., 3, 4, 6) affects smoothness and packaging. <strong>Turbocharging</strong> is common on modern diesels to increase power and efficiency while meeting emissions standards. When comparing tractors on TractorsCompare, filter by power and fuel type to find engines suited to your application.
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
