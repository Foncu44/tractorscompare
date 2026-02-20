import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PTO and Hydraulic System Guide | TractorsCompare',
  description: 'Learn about Power Take-Off (PTO) systems, hydraulic flow rates, rear lift capacity, and how to match implements to your tractor.',
};

export const dynamic = 'force-static';

export default function PTOHydraulicSystemsGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-primary-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">PTO and Hydraulic System Guide</span>
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
              PTO and Hydraulic System Guide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Learn about Power Take-Off (PTO) systems, hydraulic flow rates, rear lift capacity, and how to match implements to your tractor.
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                PTO and hydraulics are what let your tractor run and control implements. Understanding these systems helps you match a tractor to your mowers, loaders, three-point hitch tools, and other equipment. This guide explains the main specs you will see in our database.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Power Take-Off (PTO)</h2>
              <p className="leading-relaxed">
                The PTO transfers engine power to implements via a rotating shaft. <strong>PTO horsepower</strong> is the power available at the shaft—usually about 80–85% of engine HP. Implements have a minimum PTO HP requirement; your tractor should meet or exceed it. <strong>PTO speeds</strong> are standardized: 540 rpm and 1000 rpm (and often 540E and 1000E for economy). Make sure your tractor offers the speed your mower, tiller, or baler needs. <strong>Independent PTO</strong> allows the PTO to run with the tractor stopped or in neutral, which is useful for stationary work like running a grain auger.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hydraulic Flow and Pressure</h2>
              <p className="leading-relaxed">
                <strong>Pump flow</strong> (L/min or GPM) is the volume of hydraulic fluid the system can deliver. Higher flow means faster cylinder and motor movement—important for loaders, top-and-tilt, and variable-rate equipment. <strong>System pressure</strong> (bar or PSI) determines how much force the cylinders can generate. Implement manufacturers often specify minimum flow and pressure; match your tractor to those requirements for proper operation and cycle times.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Lift Capacity</h2>
              <p className="leading-relaxed">
                <strong>Rear lift capacity</strong> (at the three-point hitch) is the maximum weight the linkage can lift, usually quoted at 24 inches behind the hitch points. It limits the size and weight of rear-mounted implements you can carry. <strong>Front lift capacity</strong> (when equipped with a loader) defines how much the loader can lift; it is often given at a certain height and load center. Compare these numbers to the weight of the implements and loads you plan to use.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Valves and Remotes</h2>
              <p className="leading-relaxed">
                <strong>Hydraulic remotes</strong> (valves) are connections for auxiliary hydraulic functions. One or two remotes are common; more allow you to run multiple functions (e.g., grapple, top link, tilt) without switching hoses. Check how many remotes you need for your implements and compare tractor specs on TractorsCompare by hydraulic valves and lift capacity to find a good match.
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
