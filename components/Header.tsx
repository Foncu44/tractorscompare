'use client';

import LocaleLink from '@/components/LocaleLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdBanner } from '@/components/AdSense';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';

export default function Header({ locale }: { locale: Locale }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${pathForLocale('search', locale)}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const linkCls = "text-gray-700 hover:text-primary-600 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-primary-50 relative group";
  const spanCls = "absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full";

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo - Left */}
          <LocaleLink locale={locale} logicalPath="" className="flex items-center flex-shrink-0 group min-w-0">
            <span className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
              TractorsCompare.com
            </span>
          </LocaleLink>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-1">
            <LocaleLink locale={locale} logicalPath="" className={linkCls}>
              {t('nav.home', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
            <LocaleLink locale={locale} logicalPath="agricultural-tractors" className={linkCls}>
              {t('nav.agriculturalTractors', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
            <LocaleLink locale={locale} logicalPath="lawn-garden-tractors" className={linkCls}>
              {t('nav.lawnTractors', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
            <LocaleLink locale={locale} logicalPath="best" className={linkCls}>
              {t('nav.bestTractors', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
            <LocaleLink locale={locale} logicalPath="compare" className={linkCls}>
              {t('nav.compare', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
            <LocaleLink locale={locale} logicalPath="news" className={linkCls}>
              {t('nav.news', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
            <LocaleLink locale={locale} logicalPath="blog" className={linkCls}>
              {t('nav.blog', undefined, locale)}
              <span className={spanCls} />
            </LocaleLink>
          </nav>

          {/* Locale + Search - Right */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher locale={locale} />
          </div>
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-shrink-0">
            <div className="relative w-full min-w-[250px] group">
              <input
                id="tractor-search"
                name="q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tractors..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                aria-label="Search tractors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-200" />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
            <nav className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    id="tractor-search-mobile"
                    name="q"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tractors..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    aria-label="Search tractors"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </form>
              <LocaleLink locale={locale} logicalPath="" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.home', undefined, locale)}
              </LocaleLink>
              <LocaleLink locale={locale} logicalPath="agricultural-tractors" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.agriculturalTractors', undefined, locale)}
              </LocaleLink>
              <LocaleLink locale={locale} logicalPath="lawn-garden-tractors" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.lawnTractors', undefined, locale)}
              </LocaleLink>
              <LocaleLink locale={locale} logicalPath="best" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.bestTractors', undefined, locale)}
              </LocaleLink>
              <LocaleLink locale={locale} logicalPath="compare" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.compare', undefined, locale)}
              </LocaleLink>
              <LocaleLink locale={locale} logicalPath="news" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.news', undefined, locale)}
              </LocaleLink>
              <LocaleLink locale={locale} logicalPath="blog" className="text-gray-700 hover:text-primary-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                {t('nav.blog', undefined, locale)}
              </LocaleLink>
              <LanguageSwitcher locale={locale} />
            </nav>
          </div>
        )}
      </div>
    </header>
    <div className="bg-gray-50 border-b">
      <div className="container-custom">
        <AdBanner />
      </div>
    </div>
    </>
  );
}

