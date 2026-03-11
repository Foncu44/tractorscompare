import Link from 'next/link';
import { Tractor } from 'lucide-react';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Tractor Categories – Agricultural & Lawn Tractors Database',
  description: 'Browse tractors by category. Find agricultural farm tractors, lawn and garden tractors with complete specifications, horsepower data, and side-by-side comparisons.',
};

export default async function TractorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = locale as Locale;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-12 md:py-16">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Tractors</h1>
          <p className="text-white/80 text-lg max-w-3xl">Choose a category to explore brands and models with full specifications.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href={pathForLocale('agricultural-tractors', loc)} className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center"><Tractor className="w-5 h-5" /></div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">Agricultural Tractors</h2>
              </div>
              <p className="text-gray-600">Explore agricultural tractor brands and models with full specs.</p>
              <div className="mt-4 text-primary-700 font-semibold">View brands →</div>
            </Link>
            <Link href={pathForLocale('lawn-garden-tractors', loc)} className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-700 text-white flex items-center justify-center"><Tractor className="w-5 h-5" /></div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">Lawn Tractors</h2>
              </div>
              <p className="text-gray-600">Find mowers and lawn tractors by brand and access spec sheets.</p>
              <div className="mt-4 text-primary-700 font-semibold">View brands →</div>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Complete Tractor Database by Category</h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
              TractorsCompare provides comprehensive tractor data organized by category. Browse our category pages to explore tractors by type and compare specifications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
