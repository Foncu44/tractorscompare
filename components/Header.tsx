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
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => { setIsMenuOpen(false); setSearchOpen(false); }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${pathForLocale('search', locale)}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navItems = [
    { path: '',                      label: t('nav.home',                undefined, locale) },
    { path: 'agricultural-tractors', label: t('nav.agriculturalTractors', undefined, locale) },
    { path: 'lawn-garden-tractors',  label: t('nav.lawnTractors',         undefined, locale) },
    { path: 'best',                  label: t('nav.bestTractors',         undefined, locale) },
    { path: 'compare',               label: t('nav.compare',              undefined, locale) },
    { path: 'news',                  label: t('nav.news',                 undefined, locale) },
    { path: 'blog',                  label: t('nav.blog',                 undefined, locale) },
  ];

  return (
    <>
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header
        style={{ backgroundColor: 'var(--bg-brand-dark)', height: '60px' }}
        className="sticky top-0 z-[100] flex items-center"
      >
        <div className="container-custom w-full">
          <div className="flex items-center justify-between gap-4 h-full">

            {/* Logo */}
            <LocaleLink
              locale={locale}
              logicalPath=""
              className="flex-shrink-0 flex items-center"
              style={{
                fontFamily: '"Barlow Condensed", system-ui, sans-serif',
                fontWeight: 800,
                fontSize: '22px',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              Tractors
              <span style={{ color: 'var(--color-amber-400)' }}>Compare</span>
              <span style={{ color: 'var(--color-green-300)', fontWeight: 400, fontSize: '18px', marginLeft: '1px' }}>.com</span>
            </LocaleLink>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0" aria-label="Main navigation">
              {navItems.map(({ path, label }) => {
                const href     = pathForLocale(path, locale);
                const isActive = pathname === href || (path !== '' && pathname.startsWith(href + '/'));
                return (
                  <LocaleLink
                    key={path}
                    locale={locale}
                    logicalPath={path}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: isActive ? '#ffffff' : 'var(--color-green-300)',
                      padding: '0 12px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                      whiteSpace: 'nowrap',
                    }}
                    className="group hover:text-white"
                  >
                    {label}
                    {/* Active underline */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '12px',
                        right: '12px',
                        height: '3px',
                        backgroundColor: 'var(--color-amber-400)',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 150ms ease',
                      }}
                    />
                  </LocaleLink>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search — desktop */}
              <div className="hidden lg:flex items-center">
                {searchOpen ? (
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--fg3)' }} />
                      <input
                        autoFocus
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                        placeholder="Search tractors…"
                        aria-label="Search tractors"
                        style={{
                          width: '220px',
                          paddingLeft: '32px',
                          paddingRight: '12px',
                          paddingTop: '7px',
                          paddingBottom: '7px',
                          fontSize: '13px',
                          fontFamily: '"DM Sans", sans-serif',
                          backgroundColor: 'rgba(255,255,255,0.10)',
                          border: '1px solid rgba(255,255,255,0.20)',
                          borderRadius: '4px',
                          color: '#ffffff',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    aria-label="Open search"
                    style={{ color: 'var(--color-green-300)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                    className="hover:text-white transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              <LanguageSwitcher locale={locale} />

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2"
                aria-label="Toggle menu"
                style={{ color: 'var(--color-green-300)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          style={{ backgroundColor: 'var(--bg-brand-dark)', borderTop: '1px solid #22401A' }}
          className="lg:hidden z-[99] relative"
        >
          <div className="container-custom py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--fg3)' }} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tractors…"
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    paddingTop: '9px',
                    paddingBottom: '9px',
                    fontSize: '14px',
                    fontFamily: '"DM Sans", sans-serif',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                />
              </div>
            </form>

            <nav className="flex flex-col">
              {navItems.map(({ path, label }) => {
                const href     = pathForLocale(path, locale);
                const isActive = pathname === href || (path !== '' && pathname.startsWith(href + '/'));
                return (
                  <LocaleLink
                    key={path}
                    locale={locale}
                    logicalPath={path}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      color: isActive ? '#ffffff' : 'var(--color-green-300)',
                      padding: '10px 8px',
                      borderLeft: isActive ? '3px solid var(--color-amber-400)' : '3px solid transparent',
                      paddingLeft: isActive ? '12px' : '8px',
                      textDecoration: 'none',
                    }}
                  >
                    {label}
                  </LocaleLink>
                );
              })}
            </nav>

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #22401A' }}>
              <LanguageSwitcher locale={locale} />
            </div>
          </div>
        </div>
      )}

      {/* Ad strip */}
      <div style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>
    </>
  );
}
