'use client';

import Link from 'next/link';
import { Tractor, Scissors, Package } from 'lucide-react';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';

const types = [
  {
    slug: 'compact',
    label: 'Compact',
    description: 'Compact utility tractors for small farms and properties',
    icon: Package,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    slug: 'utility',
    label: 'Utility',
    description: 'Utility tractors for medium-scale operations',
    icon: Tractor,
    color: 'bg-green-100 text-green-700',
  },
  {
    slug: 'lawn',
    label: 'Lawn & Garden',
    description: 'Lawn and garden tractors for residential use',
    icon: Scissors,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    slug: 'mower',
    label: 'Mowers',
    description: 'Riding mowers and zero-turn mowers',
    icon: Scissors,
    color: 'bg-teal-100 text-teal-700',
  },
];

export default function HomeBrowseByType({ locale = 'en' }: { locale?: Locale }) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Browse by Type
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find tractors and equipment by type: compact, utility, lawn, garden, and mower models with detailed specifications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {types.map((type) => {
            const Icon = type.icon;
            return (
              <Link
                key={type.slug}
                href={pathForLocale(`type/${type.slug}`, locale)}
                className="group bg-white rounded-card border-2 border-gray-200 hover:border-primary-300 p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
