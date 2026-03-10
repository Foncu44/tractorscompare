import LocaleLink from '@/components/LocaleLink';
import { AdBanner } from '@/components/AdSense';
import { t } from '@/lib/i18n/t';
import type { Locale } from '@/lib/i18n/config';

const COPYRIGHT_YEAR = 2026;

const colLinkCls =
  'text-stone-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 group';
const dotCls =
  'w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0';

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-stone-950 text-stone-300 mt-20 border-t border-stone-800">
      {/* Ad row */}
      <div className="bg-stone-900 border-b border-stone-800 py-4">
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>

      {/* Main footer body */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand column — wider */}
          <div className="lg:col-span-2">
            {/* Logo lockup */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="17" r="2.5"/>
                  <circle cx="17" cy="17" r="2"/>
                  <path d="M9.5 17H15M3 17H4.5M14 17V11l4 2v4M4 10l6-4h4l2 5H4z"/>
                </svg>
              </div>
              <span className="font-heading text-lg font-bold text-white">
                TractorsCompare<span className="text-primary-400">.com</span>
              </span>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              {t('footer.tagline', undefined, locale)}
            </p>

            {/* Color accent stripe */}
            <div className="mt-6 flex gap-1.5">
              <div className="h-1 w-12 rounded-full bg-primary-600" />
              <div className="h-1 w-6  rounded-full bg-amber-500" />
              <div className="h-1 w-3  rounded-full bg-primary-400" />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-white font-bold text-sm uppercase tracking-widest mb-5">
              {t('footer.quickLinks', undefined, locale)}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { path: 'agricultural-tractors', label: t('common.agriculturalTractors', undefined, locale) },
                { path: 'lawn-garden-tractors',  label: t('common.lawnTractors',         undefined, locale) },
                { path: 'best',                  label: t('common.bestTractors',          undefined, locale) },
                { path: 'compare',               label: t('common.compare',               undefined, locale) },
                { path: 'news',                  label: t('common.news',                  undefined, locale) },
                { path: 'blog',                  label: t('common.blog',                  undefined, locale) },
              ].map(({ path, label }) => (
                <li key={path}>
                  <LocaleLink locale={locale} logicalPath={path} className={colLinkCls}>
                    <span className={dotCls} />
                    {label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-white font-bold text-sm uppercase tracking-widest mb-5">
              {t('footer.categories', undefined, locale)}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { path: 'tractors', label: t('common.tractorDatabase',  undefined, locale) },
                { path: 'best',     label: t('common.bestTractors',      undefined, locale) },
                { path: 'compare',  label: t('common.compareTractors',   undefined, locale) },
                { path: 'brands',   label: t('common.allBrands',         undefined, locale) },
              ].map(({ path, label }) => (
                <li key={path}>
                  <LocaleLink locale={locale} logicalPath={path} className={colLinkCls}>
                    <span className={dotCls} />
                    {label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / legal */}
          <div>
            <h3 className="font-heading text-white font-bold text-sm uppercase tracking-widest mb-5">
              {t('footer.contact', undefined, locale)}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { path: 'contact',    label: t('common.contactUs',              undefined, locale) },
                { path: 'about-us',   label: t('common.aboutUs',                undefined, locale) },
                { path: 'privacy',    label: t('common.privacy',                undefined, locale) },
                { path: 'terms',      label: t('common.terms',                  undefined, locale) },
                { path: 'methodology',label: t('common.methodology',            undefined, locale) },
                { path: 'disclaimer', label: t('common.editorialAdsDisclosure', undefined, locale) },
              ].map(({ path, label }) => (
                <li key={path}>
                  <LocaleLink locale={locale} logicalPath={path} className={colLinkCls}>
                    <span className={dotCls} />
                    {label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 text-center md:text-left">
            {t('footer.copyright', { year: String(COPYRIGHT_YEAR) }, locale)}
          </p>
          <p className="text-xs text-stone-600 text-center max-w-lg leading-relaxed">
            {t('footer.disclaimer', undefined, locale)}
          </p>
        </div>
      </div>
    </footer>
  );
}
