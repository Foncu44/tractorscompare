import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Understanding Tractor Specifications | TractorsCompare',
  description: 'Learn how to read and compare engine, transmission, and PTO specifications. Guide to tractor specs and technical data.',
};

export const dynamic = 'force-static';

export default function TractorSpecificationsGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-primary-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Understanding Tractor Specifications</span>
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
              Understanding Tractor Specifications
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Learn how to read and compare engine, transmission, and PTO specifications
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                Tractor specifications are the key to comparing models and choosing the right machine for your needs. This guide explains the main spec categories you will see in our database: engine, transmission, PTO, hydraulics, dimensions, and weight.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Engine Specifications</h2>
              <p className="leading-relaxed">
                <strong>Horsepower (HP)</strong> is the most cited engine spec. Gross HP is measured at the engine; net HP reflects power at the PTO or drawbar. Higher HP generally means more capacity for heavy implements and faster fieldwork, but also higher fuel use and cost. <strong>Displacement</strong> (liters or cubic inches) and <strong>cylinders</strong> give a sense of engine size. <strong>Fuel type</strong> is usually diesel for agricultural tractors. <strong>Torque</strong> (Nm or lb-ft) indicates pulling ability, especially at low RPM.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Transmission</h2>
              <p className="leading-relaxed">
                <strong>Manual</strong> transmissions offer fixed gear ratios and are simple to maintain. <strong>Powershift</strong> and partial powershift options allow shifting under load. <strong>Hydrostatic (HST)</strong> transmissions provide infinite speed variation within a range and are popular on compacts. <strong>CVT</strong> (continuously variable) transmissions automatically adjust for load and speed and are common on larger tractors. The right choice depends on your tasks and preference for ease of use vs. cost and complexity.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">PTO (Power Take-Off)</h2>
              <p className="leading-relaxed">
                <strong>PTO horsepower</strong> is the power available at the PTO shaft—often about 80–85% of engine HP. Implements are rated for a minimum PTO HP, so match your tractor to your mower, tiller, or baler. <strong>PTO speeds</strong> are typically 540 rpm and/or 1000 rpm (and often 540E/1000E for economy). Check that your tractor offers the speed your implements require. <strong>Independent vs. live PTO</strong> affects whether the PTO can run with the tractor stopped or in neutral.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hydraulic System</h2>
              <p className="leading-relaxed">
                <strong>Pump flow</strong> (L/min or GPM) determines how quickly cylinders and motors can move—important for loaders and variable-rate equipment. <strong>Lift capacity</strong> (kg or lb) at the three-point hitch and, if applicable, front linkage limits the weight of implements you can carry. <strong>Number of valves</strong> (remotes) defines how many hydraulic functions you can control (e.g., top-and-tilt, grapple). Higher flow and capacity support larger loaders and more demanding implements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Dimensions and Weight</h2>
              <p className="leading-relaxed">
                <strong>Weight</strong> affects traction and transport. Heavier tractors generally have better drawbar pull but may require a heavier trailer. <strong>Length, width, height</strong> and <strong>wheelbase</strong> matter for storage, gates, and road transport. <strong>Ground clearance</strong> can be important for row-crop or rough terrain. Use our comparison tool to filter and sort tractors by these specs to find the best match for your operation.
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
