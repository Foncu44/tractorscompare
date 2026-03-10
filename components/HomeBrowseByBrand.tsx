'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { brandToSlug } from '@/lib/tractorsLoader';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import { ArrowRight } from 'lucide-react';

interface HomeBrowseByBrandProps {
  brands: string[];
  locale?: Locale;
}

export default function HomeBrowseByBrand({ brands, locale = 'en' }: HomeBrowseByBrandProps) {
  const topBrands = ['John Deere', 'Kubota', 'McCormick'];
  const otherBrands = brands.filter(b => !topBrands.includes(b)).slice(0, 3);
  const displayBrands = [...topBrands, ...otherBrands];

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-widest mb-2">Brands</p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
              Browse by Manufacturer
            </h2>
            <p className="text-stone-500 mt-2 text-base leading-relaxed max-w-lg">
              Explore tractor models, series, and specifications by manufacturer.
            </p>
          </div>
          <Link
            href={pathForLocale('brands', locale)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group whitespace-nowrap"
          >
            View all brands
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Brand grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayBrands.map((brand) => {
            const slug = brandToSlug(brand);
            return (
              <Link
                key={brand}
                href={pathForLocale(`brands/${slug}`, locale)}
                className="group relative bg-white rounded-2xl border-2 border-stone-100 hover:border-primary-300 p-5 md:p-6 text-center transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Subtle hover fill */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <BrandLogo brandName={brand} width={56} height={56} className="md:w-16 md:h-16 object-contain" />
                  </div>
                  <span className="font-semibold text-stone-700 group-hover:text-primary-700 transition-colors text-xs md:text-sm leading-tight">
                    {brand}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
