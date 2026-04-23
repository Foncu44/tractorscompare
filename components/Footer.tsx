import LocaleLink from '@/components/LocaleLink';
import { AdBanner } from '@/components/AdSense';
import { t } from '@/lib/i18n/t';
import type { Locale } from '@/lib/i18n/config';

const COPYRIGHT_YEAR = 2026;

function FooterLink({ locale, path, label }: { locale: Locale; path: string; label: string }) {
  return (
    <li>
      <LocaleLink
        locale={locale}
        logicalPath={path}
        style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '13px',
          color: 'var(--color-green-300)',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'color 150ms ease',
          lineHeight: '1.6',
        }}
        className="hover:text-white"
      >
        {label}
      </LocaleLink>
    </li>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: '"Barlow Condensed", system-ui, sans-serif',
        fontWeight: 700,
        fontSize: '13px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: '#ffffff',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer
      style={{ backgroundColor: 'var(--bg-brand-dark)', color: '#6AAB46', marginTop: '80px' }}
    >
      {/* Ad strip */}
      <div style={{ backgroundColor: '#162309', borderBottom: '1px solid #22401A' }} className="py-3">
        <div className="container-custom">
          <AdBanner />
        </div>
      </div>

      {/* Main body */}
      <div className="container-custom" style={{ paddingTop: '48px', paddingBottom: '40px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div
              style={{
                fontFamily: '"Barlow Condensed", system-ui, sans-serif',
                fontWeight: 800,
                fontSize: '22px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.02em',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              Tractors<span style={{ color: 'var(--color-amber-400)' }}>Compare</span>
              <span style={{ color: 'var(--color-green-300)', fontWeight: 400, fontSize: '18px' }}>.com</span>
            </div>

            <p style={{ fontSize: '13px', lineHeight: '1.65', color: '#6AAB46', maxWidth: '260px' }}>
              {t('footer.tagline', undefined, locale)}
            </p>

            <div className="flex gap-2 mt-5">
              <div style={{ height: '3px', width: '40px', borderRadius: '999px', backgroundColor: 'var(--color-green-700)' }} />
              <div style={{ height: '3px', width: '20px', borderRadius: '999px', backgroundColor: 'var(--color-amber-600)' }} />
              <div style={{ height: '3px', width: '10px', borderRadius: '999px', backgroundColor: 'var(--color-green-500)' }} />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <FooterHeading>{t('footer.quickLinks', undefined, locale)}</FooterHeading>
            <ul className="space-y-2">
              {[
                { path: 'agricultural-tractors', label: t('common.agriculturalTractors', undefined, locale) },
                { path: 'lawn-garden-tractors',  label: t('common.lawnTractors',         undefined, locale) },
                { path: 'best',                  label: t('common.bestTractors',          undefined, locale) },
                { path: 'compare',               label: t('common.compare',               undefined, locale) },
                { path: 'news',                  label: t('common.news',                  undefined, locale) },
                { path: 'blog',                  label: t('common.blog',                  undefined, locale) },
              ].map(({ path, label }) => (
                <FooterLink key={path} locale={locale} path={path} label={label} />
              ))}
            </ul>
          </div>

          {/* Data */}
          <div>
            <FooterHeading>{t('footer.categories', undefined, locale)}</FooterHeading>
            <ul className="space-y-2">
              {[
                { path: 'tractors',    label: t('common.tractorDatabase',  undefined, locale) },
                { path: 'best',        label: t('common.bestTractors',      undefined, locale) },
                { path: 'compare',     label: t('common.compareTractors',   undefined, locale) },
                { path: 'brands',      label: t('common.allBrands',         undefined, locale) },
                { path: 'tractor-data',label: 'Tractor Data' },
              ].map(({ path, label }) => (
                <FooterLink key={path} locale={locale} path={path} label={label} />
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <FooterHeading>{t('footer.contact', undefined, locale)}</FooterHeading>
            <ul className="space-y-2">
              {[
                { path: 'contact',     label: t('common.contactUs',              undefined, locale) },
                { path: 'about-us',    label: t('common.aboutUs',                undefined, locale) },
                { path: 'privacy',     label: t('common.privacy',                undefined, locale) },
                { path: 'terms',       label: t('common.terms',                  undefined, locale) },
                { path: 'methodology', label: t('common.methodology',            undefined, locale) },
                { path: 'disclaimer',  label: t('common.editorialAdsDisclosure', undefined, locale) },
              ].map(({ path, label }) => (
                <FooterLink key={path} locale={locale} path={path} label={label} />
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #22401A',
            marginTop: '40px',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '12px', color: 'var(--color-green-500)', fontFamily: '"DM Sans", sans-serif' }}>
            {t('footer.copyright', { year: String(COPYRIGHT_YEAR) }, locale)}
          </p>
          <p style={{ fontSize: '11px', color: 'var(--color-green-700)', fontFamily: '"DM Sans", sans-serif', maxWidth: '520px', lineHeight: '1.6', textAlign: 'right' as const }}>
            {t('footer.disclaimer', undefined, locale)}
          </p>
        </div>
      </div>
    </footer>
  );
}
