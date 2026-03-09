'use client';

import Link from 'next/link';
import { getBrandLogo, getBrandColor } from '@/lib/brandLogos';
import { brandToSlug } from '@/lib/tractorsLoader';
import BrandLogo from '@/components/BrandLogo';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';

interface HomeBrowseByBrandProps {
  brands: string[];
  locale?: Locale;
}

export default function HomeBrowseByBrand({ brands, locale = 'en' }: HomeBrowseByBrandProps) {
  const topBrands = ['John Deere', 'Kubota', 'McCormick'];
  const otherBrands = brands.filter(b => !topBrands.includes(b)).slice(0, 3);
  const displayBrands = [...topBrands, ...otherBrands];

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container-custom">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">Browse by Brand</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
            Explore tractor models, series, and specifications by manufacturer. Find detailed tractor data for each brand.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayBrands.map((brand) => {
            const slug = brandToSlug(brand);
            return (
              <Link
                key={brand}
                href={pathForLocale(`brands/${slug}`, locale)}
                className="group bg-white rounded-card border-2 border-gray-200 hover:border-primary-300 p-4 md:p-6 text-center transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <BrandLogo brandName={brand} width={64} height={64} className="md:w-20 md:h-20" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-xs md:text-sm lg:text-base">{brand}</h3>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <Link href={pathForLocale('brands', locale)} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors text-sm md:text-base">
            View all brands →
          </Link>
        </div>
      </div>
    </section>
  );
}
