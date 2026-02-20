import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transmission Types: Manual, HST, CVT | TractorsCompare',
  description: 'Compare manual, hydrostatic (HST), and continuously variable (CVT) transmissions. Learn which transmission type suits your needs.',
};

export const dynamic = 'force-static';

export default function TransmissionTypesGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-primary-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Transmission Types: Manual, HST, CVT</span>
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
              Transmission Types: Manual, HST, CVT
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Compare manual, hydrostatic (HST), and continuously variable (CVT) transmissions. Learn which transmission type suits your needs.
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                The transmission determines how engine power reaches the wheels and how you control speed and direction. Choosing the right type affects ease of use, efficiency, maintenance cost, and suitability for tasks like loader work or precision fieldwork.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Manual Transmissions</h2>
              <p className="leading-relaxed">
                Manual (gear) transmissions use a clutch and fixed gear ratios. They are simple, durable, and usually the most affordable to buy and repair. Operators select a gear for the desired speed and load; shifting under load may require clutching. Manuals are common on utility and older tractors. They suit operators who are comfortable with a clutch and prefer lower complexity and cost.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Powershift and Partial Powershift</h2>
              <p className="leading-relaxed">
                Powershift transmissions allow shifting between several ranges or gears without using the clutch, often under load. They reduce operator effort and can improve productivity in tasks that require frequent speed changes. Partial powershift offers some clutchless steps within ranges. These transmissions are a step up in cost and complexity from a basic manual but remain easier to service than full hydrostatic or CVT systems.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hydrostatic Transmission (HST)</h2>
              <p className="leading-relaxed">
                Hydrostatic transmissions use hydraulic pumps and motors to provide infinitely variable speed within a range. Forward and reverse are typically controlled by a single lever or pedals, with no gears to shift. HST is very popular on compact tractors and loaders because it allows precise, smooth control and easy direction changes. It can use more fuel under heavy load than a gear transmission and has higher purchase and repair costs.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Continuously Variable Transmission (CVT)</h2>
              <p className="leading-relaxed">
                CVT systems automatically vary the ratio between engine and wheels so the engine can run in an efficient range while ground speed is adjusted. They offer smooth operation, no manual shifting, and often good fuel efficiency. CVTs are common on larger modern tractors. They are more complex and costly to maintain than manual or basic powershift units. When comparing tractors on TractorsCompare, filter by transmission type to see which models offer the option you prefer.
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
