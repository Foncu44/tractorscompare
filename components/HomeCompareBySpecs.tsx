'use client';

import Link from 'next/link';
import { Settings, Fuel, Zap, Cog, Wrench, Ruler, Weight, ArrowRight } from 'lucide-react';

const keySpecs = [
  { label: 'Engine', icon: Settings, keyword: 'engine' },
  { label: 'Fuel Type', icon: Fuel, keyword: 'fuel diesel' },
  { label: 'Power / Horsepower', icon: Zap, keyword: 'power horsepower' },
  { label: 'Transmission', icon: Cog, keyword: 'transmission' },
  { label: 'PTO', icon: Wrench, keyword: 'pto' },
  { label: 'Hydraulic System', icon: Settings, keyword: 'hydraulic' },
  { label: 'Rear Lift Capacity', icon: Weight, keyword: 'rear lift capacity' },
  { label: 'Dimensions', icon: Ruler, keyword: 'dimensions' },
  { label: 'Weight', icon: Weight, keyword: 'weight' },
];

export default function HomeCompareBySpecs() {
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Compare by Specifications
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compare tractors by key technical specifications: engine, fuel type, power, horsepower, transmission, PTO, hydraulic system, rear lift capacity, dimensions, and weight.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {keySpecs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.keyword}
                  className="flex flex-col items-center text-center gap-2 p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <Icon className="w-6 h-6 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-900">{spec.label}</span>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <Link
              href="/comparar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Compare Tractors
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
