import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tractor Guides & Buying Information | TractorsCompare',
  description: 'Comprehensive guides about tractors, specifications, buying tips, and equipment information. Learn about engine types, transmission options, PTO systems, hydraulic systems, and more.',
};

const guides = [
  {
    title: 'Understanding Tractor Specifications',
    description: 'Learn how to read and interpret tractor specifications including engine, transmission, PTO, hydraulic system, dimensions, and weight.',
    href: '/guides/tractor-specifications',
    category: 'Buying Guide',
  },
  {
    title: 'Choosing the Right Tractor Size',
    description: 'Determine the right tractor size based on your property size, tasks, and power requirements. Compare compact, utility, and large tractors.',
    href: '/guides/choosing-tractor-size',
    category: 'Buying Guide',
  },
  {
    title: 'Tractor Engine Types Explained',
    description: 'Understand diesel vs gasoline engines, horsepower ratings, torque, and engine specifications for different tractor applications.',
    href: '/guides/tractor-engines',
    category: 'Technical Guide',
  },
  {
    title: 'Transmission Types: Manual, HST, CVT',
    description: 'Compare manual, hydrostatic (HST), and continuously variable (CVT) transmissions. Learn which transmission type suits your needs.',
    href: '/guides/transmission-types',
    category: 'Technical Guide',
  },
  {
    title: 'PTO and Hydraulic System Guide',
    description: 'Learn about Power Take-Off (PTO) systems, hydraulic flow rates, rear lift capacity, and how to match implements to your tractor.',
    href: '/guides/pto-hydraulic-systems',
    category: 'Technical Guide',
  },
  {
    title: 'Tractor Maintenance Basics',
    description: 'Essential maintenance tips for diesel engines, hydraulic systems, transmissions, and overall tractor care to ensure long-term performance.',
    href: '/guides/tractor-maintenance',
    category: 'Maintenance',
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Guides</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tractor Guides & Information
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive guides about tractors, specifications, buying tips, and equipment information. Learn about engine types, transmission options, PTO systems, hydraulic systems, dimensions, and performance data.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Link
                key={index}
                href={guide.href}
                className="group bg-white rounded-xl border-2 border-gray-200 hover:border-primary-300 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-primary-600 uppercase mb-2 block">
                      {guide.category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {guide.description}
                    </p>
                    <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-semibold text-sm">
                      Read guide
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Comprehensive Tractor Guides and Buying Information
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Choosing the right tractor is one of the most important decisions for farmers, landscapers, and property owners. Our comprehensive guides provide detailed information about tractor specifications, buying considerations, technical features, and equipment selection to help you make informed decisions.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Understanding Tractor Specifications
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Tractor specifications provide essential information about performance, capability, and suitability for specific tasks. Engine specifications include horsepower (HP), which determines the tractor's power output, engine displacement measured in liters or cubic inches, number of cylinders, fuel type (typically diesel for agricultural models), compression ratio, and starter voltage. Higher horsepower generally means more capability, but it's important to match power to your specific needs to avoid unnecessary fuel consumption and costs.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Transmission specifications are crucial for understanding how the tractor operates. Manual transmissions offer direct control with specific gear ratios, while hydrostatic transmissions (HST) provide infinite speed variation within a range, making them ideal for tasks requiring frequent direction changes. Continuously variable transmissions (CVT) combine efficiency with ease of use, automatically adjusting gear ratios for optimal performance.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              PTO and Hydraulic Systems Guide
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              The Power Take-Off (PTO) system transfers engine power to implements such as mowers, tillers, and balers. PTO specifications include PTO horsepower (typically 85% of engine horsepower), PTO RPM (standard speeds are 540 rpm and 1000 rpm), and PTO type (rear, mid, or front). Matching PTO specifications to your implements ensures efficient operation and prevents damage.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Hydraulic systems power implements like loaders, backhoes, and three-point hitch attachments. Key specifications include hydraulic flow rate measured in gallons per minute (GPM) or liters per minute (LPM), system pressure measured in PSI or bar, rear lift capacity indicating maximum weight that can be lifted at the three-point hitch, and number of hydraulic remotes for operating multiple implements simultaneously.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Choosing the Right Tractor Size
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Selecting the appropriate tractor size depends on your property size, intended tasks, and budget. Compact tractors (typically 20-40 HP) are ideal for small properties, landscaping, and residential use. Utility tractors (40-100 HP) suit medium-scale operations and diverse tasks. Large agricultural tractors (100+ HP) are designed for extensive farming operations, heavy tillage, and large-scale harvesting.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Consider physical dimensions when selecting a tractor. Length, width, and height determine if the tractor fits in storage buildings or through gates. Wheelbase affects maneuverability, with shorter wheelbases providing better turning radius. Weight impacts traction and transport requirements, with heavier tractors providing better traction for heavy-duty work but requiring more powerful tow vehicles for transport.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Tractor Maintenance and Care
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Regular maintenance ensures optimal performance and longevity. Diesel engines require regular oil changes, fuel filter replacement, air filter cleaning or replacement, and cooling system maintenance. Hydraulic systems need periodic fluid changes and filter replacement. Transmission maintenance varies by type, with hydrostatic transmissions requiring specific fluid types and service intervals.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Proper storage, regular inspections, and following manufacturer service recommendations help maintain tractor value and prevent costly repairs. Keep service records, use appropriate fuels and lubricants, and address issues promptly to ensure reliable operation throughout the tractor's lifespan.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Compare Tractors?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our comparison tool to compare tractors by specifications, engine, transmission, PTO, hydraulic system, dimensions, and weight.
          </p>
          <Link
            href="/comparar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            Compare Tractors
          </Link>
        </div>
      </section>
    </div>
  );
}
