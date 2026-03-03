import LocaleLink from '@/components/LocaleLink';
import { AdBanner } from '@/components/AdSense';
import { t } from '@/lib/i18n/t';
import type { Locale } from '@/lib/i18n/config';

const COPYRIGHT_YEAR = 2026;
const linkCls = "text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-20 border-t border-gray-800">
      <div className="bg-gray-50/50 border-b border-gray-800 py-4">
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white font-bold text-xl mb-5">{t('common.siteName', undefined, locale)}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{t('footer.tagline', undefined, locale)}</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-5">{t('footer.quickLinks', undefined, locale)}</h3>
            <ul className="space-y-3 text-sm">
              <li><LocaleLink locale={locale} logicalPath="agricultural-tractors" className={linkCls}>{t('common.agriculturalTractors', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="lawn-garden-tractors" className={linkCls}>{t('common.lawnTractors', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="best" className={linkCls}>{t('common.bestTractors', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="compare" className={linkCls}>{t('common.compare', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="news" className={linkCls}>{t('common.news', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="blog" className={linkCls}>{t('common.blog', undefined, locale)}</LocaleLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-5">{t('footer.categories', undefined, locale)}</h3>
            <ul className="space-y-3 text-sm">
              <li><LocaleLink locale={locale} logicalPath="tractors" className={linkCls}>{t('common.tractorDatabase', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="best" className={linkCls}>{t('common.bestTractors', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="compare" className={linkCls}>{t('common.compareTractors', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="brands" className={linkCls}>{t('common.allBrands', undefined, locale)}</LocaleLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-5">{t('footer.contact', undefined, locale)}</h3>
            <ul className="space-y-3 text-sm">
              <li><LocaleLink locale={locale} logicalPath="contact" className={linkCls}>{t('common.contactUs', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="about-us" className={linkCls}>{t('common.aboutUs', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="privacy" className={linkCls}>{t('common.privacy', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="terms" className={linkCls}>{t('common.terms', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="methodology" className={linkCls}>{t('common.methodology', undefined, locale)}</LocaleLink></li>
              <li><LocaleLink locale={locale} logicalPath="disclaimer" className={linkCls}>{t('common.editorialAdsDisclosure', undefined, locale)}</LocaleLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">{t('footer.copyright', { year: String(COPYRIGHT_YEAR) }, locale)}</p>
          <p className="mt-3 text-xs text-gray-500 max-w-2xl mx-auto">{t('footer.disclaimer', undefined, locale)}</p>
        </div>
      </div>
    </footer>
  );
}

