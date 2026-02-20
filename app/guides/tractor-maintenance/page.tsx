import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tractor Maintenance Guide | TractorsCompare',
  description: 'Essential maintenance tips for diesel engines and hydraulic systems. Keep your tractor in top condition.',
};

export const dynamic = 'force-static';

export default function TractorMaintenanceGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/guides" className="hover:text-primary-600">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Tractor Maintenance Guide</span>
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
              <span>Maintenance</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Tractor Maintenance Guide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Essential maintenance tips for diesel engines and hydraulic systems
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="leading-relaxed">
                Regular maintenance keeps your tractor reliable, extends its life, and helps avoid costly breakdowns. This guide covers the main areas: engine, hydraulics, transmission, and general care. Always follow your manufacturer&apos;s service intervals and use recommended fluids and filters.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Diesel Engine Maintenance</h2>
              <p className="leading-relaxed">
                <strong>Oil changes</strong> are critical. Use the oil type and viscosity specified in the manual and change at the recommended interval (often 100–500 hours). Replace the oil filter at every oil change. <strong>Air filters</strong> should be checked regularly and replaced or cleaned according to the manual; a clogged filter reduces power and can increase wear. <strong>Fuel filters</strong> need periodic replacement to protect the injection system. <strong>Coolant</strong> level and concentration should be checked; replace at the interval specified by the manufacturer to avoid overheating and corrosion.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Hydraulic System Care</h2>
              <p className="leading-relaxed">
                Hydraulic fluid and filters are often overlooked. <strong>Fluid level</strong> should be checked with the tractor on level ground; low fluid can cause poor performance and pump damage. <strong>Fluid changes</strong> and <strong>filter replacement</strong> at the recommended intervals keep the system clean and protect valves and cylinders. Use only the hydraulic fluid specified by the manufacturer. Watch for leaks at hoses, fittings, and cylinders and fix them promptly to avoid contamination and loss of performance.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Transmission and Driveline</h2>
              <p className="leading-relaxed">
                Transmission maintenance depends on type. <strong>Manual and powershift</strong> units typically need periodic oil and filter changes. <strong>Hydrostatic</strong> transmissions require the correct fluid and strict adherence to service intervals. <strong>CVT</strong> tractors often have specific fluid and filter requirements. Check the operator manual for drain and fill procedures. Keep the transmission breather clean and ensure the unit is not overfilled or underfilled.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">General Tips</h2>
              <p className="leading-relaxed">
                Store the tractor under cover when possible to protect paint, rubber, and electrical components. Keep the battery charged and terminals clean. Grease all zerks at the intervals specified—loader pins, three-point hitch, and steering joints. Check tire pressure and condition. Inspect belts and hoses for wear and replace as needed. Keep a log of service dates and hours so you never miss an interval. When in doubt, refer to the manufacturer&apos;s manual or an authorized dealer.
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
