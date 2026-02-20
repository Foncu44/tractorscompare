import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { Settings, Fuel, Zap, Cog, Wrench, Ruler, Weight, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tractor Specifications Glossary – Definitions & Technical Terms | TractorsCompare',
  description: 'Complete glossary of tractor specifications and technical terms. Learn about PTO, hydraulic flow, rear lift capacity, horsepower vs power, transmission types, diesel fuel, dimensions, weight, and more.',
};

const specs = [
  {
    term: 'PTO (Power Take-Off)',
    definition: 'The PTO (Power Take-Off) is a rotating shaft that transfers power from the tractor engine to attached implements. Common PTO speeds are 540 rpm and 1000 rpm. PTO horsepower is typically 85% of engine horsepower.',
    icon: Wrench,
  },
  {
    term: 'Hydraulic Flow',
    definition: 'Hydraulic flow measures the volume of hydraulic fluid (in gallons per minute or liters per minute) that the hydraulic system can deliver. Higher flow rates allow for faster operation of hydraulic attachments and loaders.',
    icon: Settings,
  },
  {
    term: 'Rear Lift Capacity',
    definition: 'Rear lift capacity indicates the maximum weight a tractor can lift at the three-point hitch. This specification is crucial for determining which implements and attachments the tractor can safely operate.',
    icon: Weight,
  },
  {
    term: 'Horsepower vs Power',
    definition: 'Horsepower (HP) is a unit of power measurement. Gross horsepower is measured at the engine, while net horsepower accounts for power losses. PTO horsepower is the power available at the power take-off shaft.',
    icon: Zap,
  },
  {
    term: 'Transmission Types',
    definition: 'Tractors feature various transmission types: manual (gear), hydrostatic (HST), continuously variable (CVT), and power shift. Each offers different benefits for operation, efficiency, and ease of use.',
    icon: Cog,
  },
  {
    term: 'Diesel Fuel',
    definition: 'Most modern tractors use diesel fuel due to its efficiency, torque output, and durability. Diesel engines provide better fuel economy and longer engine life compared to gasoline engines.',
    icon: Fuel,
  },
  {
    term: 'Dimensions',
    definition: 'Tractor dimensions include length, width, height, and wheelbase. These measurements are essential for determining if a tractor fits in storage buildings, trailers, or through gates and doorways.',
    icon: Ruler,
  },
  {
    term: 'Weight',
    definition: 'Tractor weight affects traction, stability, and transport requirements. Operating weight includes the tractor with fluids, operator, and standard equipment. Heavier tractors provide better traction for heavy-duty work.',
    icon: Weight,
  },
];

export default function SpecsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Specifications Glossary</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tractor Specifications Glossary
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Understand tractor specifications and technical terms. Learn about engine, transmission, PTO, hydraulic system, dimensions, weight, and performance data.
          </p>
        </div>
      </section>

      {/* Specs List */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {spec.term}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {spec.definition}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schema.org FAQPage */}
      <Script
        id="specs-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: specs.map((spec) => ({
              '@type': 'Question',
              name: `What is ${spec.term}?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: spec.definition,
              },
            })),
          }),
        }}
      />

      {/* Comprehensive Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg prose-sm md:prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Complete Guide to Tractor Specifications and Technical Terms
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Understanding tractor specifications is essential for making informed purchasing decisions and ensuring that a tractor meets your specific operational requirements. This comprehensive glossary explains key technical terms, measurements, and specifications used in the tractor industry, helping you interpret specification sheets and compare different models effectively.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Engine Specifications Explained
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Horsepower (HP) measures the engine's power output and is the most commonly referenced specification. Gross horsepower is measured at the engine without accessories, while net horsepower accounts for power consumed by cooling fans, alternators, and other accessories. PTO horsepower is the power available at the power take-off shaft, typically 85% of net horsepower. Higher horsepower generally means more capability, but also higher fuel consumption and cost.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Engine displacement, measured in liters or cubic inches, indicates the total volume swept by all pistons. Larger displacement engines typically produce more power and torque. The number of cylinders affects smoothness of operation, with more cylinders generally providing smoother power delivery. Fuel type (diesel, gasoline, or electric) impacts operating costs, emissions, and performance characteristics.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Transmission Systems and Operation
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Manual transmissions provide specific gear ratios selected by the operator, offering direct control and typically better fuel efficiency. Gear counts (forward and reverse) indicate available speed options. Hydrostatic transmissions (HST) use hydraulic pumps and motors to provide infinite speed variation within a range, making them ideal for tasks requiring frequent direction changes like loader work or mowing.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Continuously variable transmissions (CVT) automatically adjust gear ratios for optimal efficiency, combining the ease of hydrostatic operation with the efficiency of mechanical transmissions. Power shift transmissions allow changing gears under load without stopping, improving productivity in field operations. Each transmission type offers different benefits depending on intended use.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Hydraulic and PTO Systems
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Hydraulic flow rate, measured in gallons per minute (GPM) or liters per minute (LPM), determines how quickly hydraulic implements operate. Higher flow rates enable faster loader cycles and more responsive implement control. System pressure, measured in PSI or bar, determines lifting capacity and force application. Rear lift capacity indicates the maximum weight that can be lifted at the three-point hitch, crucial for matching implements to tractor capability.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              PTO (Power Take-Off) specifications include PTO horsepower, which is the power available at the PTO shaft (typically 85% of engine horsepower), and PTO speed, commonly 540 rpm or 1000 rpm. Some tractors offer both speeds, while others have a single speed. Matching PTO speed to implement requirements is essential for efficient operation and preventing implement damage.
            </p>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">
              Dimensions and Weight Considerations
            </h3>
            
            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Length, width, and height measurements are critical for determining if a tractor fits in storage buildings, through gates, or on trailers. Width can vary with tire configuration, so consider both narrow and wide tire options. Height must account for cab or ROPS (Roll-Over Protection Structure) clearance. Wheelbase affects turning radius and stability, with shorter wheelbases providing better maneuverability but potentially less stability.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4 leading-relaxed">
              Operating weight includes the tractor with fluids, operator, and standard equipment. Weight affects traction, stability, and transport requirements. Heavier tractors provide better traction for heavy-duty work but require more powerful tow vehicles for transport. Ballast may be added to improve traction, but this increases total weight and must be considered for transport planning.
            </p>

            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              Understanding these specifications helps you select the right tractor for your needs, compare different models effectively, and ensure that chosen equipment matches your operational requirements. Use our comprehensive comparison tool to evaluate specifications across multiple models and make informed purchasing decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Compare Specifications?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use our comparison tool to compare tractors by engine, transmission, PTO, hydraulic system, dimensions, and weight.
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
