'use client';

import LocaleLink from '@/components/LocaleLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdBanner } from '@/components/AdSense';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';

export default function Header({ locale }: { locale: Locale }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Detect scroll to add shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${pathForLocale('search', locale)}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navItems = [
    { path: '',                      label: t('nav.home',               undefined, locale) },
    { path: 'agricultural-tractors', label: t('nav.agriculturalTractors', undefined, locale) },
    { path: 'lawn-garden-tractors',  label: t('nav.lawnTractors',        undefined, locale) },
    { path: 'best',                  label: t('nav.bestTractors',        undefined, locale) },
    { path: 'compare',               label: t('nav.compare',             undefined, locale) },
    { path: 'news',                  label: t('nav.news',                undefined, locale) },
    { path: 'blog',                  label: t('nav.blog',                undefined, locale) },
  ];

  return (
    <>
      {/* ── Main Header ── */}
      <header
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'shadow-[0_2px_20px_-4px_rgba(0,0,0,0.10)] border-b border-stone-100'
            : 'border-b border-stone-100/60'
        }`}
      >
        {/* Accent top bar */}
        <div className="h-0.5 bg-gradient-to-r from-primary-700 via-primary-500 to-amber-500" />

        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-[68px] gap-3">

            {/* ── Logo ── */}
            <LocaleLink
              locale={locale}
              logicalPath=""
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-700 transition-colors duration-200 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="17" r="2.5"/>
                  <circle cx="17" cy="17" r="2"/>
                  <path d="M9.5 17H15M3 17H4.5M14 17V11l4 2v4M4 10l6-4h4l2 5H4z"/>
                </svg>
              </div>
              <span className="font-heading text-lg md:text-xl font-bold text-stone-900 group-hover:text-primary-700 transition-colors duration-200 hidden sm:block leading-tight">
                TractorsCompare<span className="text-primary-600">.com</span>
              </span>
            </LocaleLink>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Main navigation">
              {navItems.map(({ path, label }) => {
                const href = pathForLocale(path, locale);
                const isActive =
                  pathname === href ||
                  (path !== '' && pathname.startsWith(href + '/'));
                return (
                  <LocaleLink
                    key={path}
                    locale={locale}
                    logicalPath={path}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap group
                      ${isActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-stone-600 hover:text-primary-700 hover:bg-primary-50/70'
                      }`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-primary-500 transition-all duration-300
                        ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'}`}
                      style={{ transformOrigin: 'left' }}
                    />
                  </LocaleLink>
                );
              })}
            </nav>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Search — desktop */}
              <div className="hidden lg:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="header-search"
                        name="q"
                        type="search"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                        placeholder="Search tractors…"
                        className="w-56 pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-button bg-stone-50 focus:bg-white focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all"
                        aria-label="Search tractors"
                      />
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    aria-label="Open search"
                    className="p-2 rounded-lg text-stone-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              <LanguageSwitcher locale={locale} />

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          {isMenuOpen && (
            <div className="lg:hidden pb-5 pt-3 border-t border-stone-100 animate-fade-in">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id="header-search-mobile"
                    name="q"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tractors…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-button bg-stone-50 focus:bg-white focus:ring-2 focus:ring-primary-400 outline-none"
                    aria-label="Search tractors"
                  />
                </div>
              </form>

              {/* Mobile nav */}
              <nav className="flex flex-col gap-0.5">
                {navItems.map(({ path, label }) => {
                  const href = pathForLocale(path, locale);
                  const isActive =
                    pathname === href ||
                    (path !== '' && pathname.startsWith(href + '/'));
                  return (
                    <LocaleLink
                      key={path}
                      locale={locale}
                      logicalPath={path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors
                        ${isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-stone-700 hover:bg-stone-50 hover:text-primary-700'
                        }`}
                    >
                      {label}
                    </LocaleLink>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-stone-100">
                <LanguageSwitcher locale={locale} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Ad Banner below header ── */}
      <div className="bg-stone-50 border-b border-stone-100">
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>
    </>
  );
}
