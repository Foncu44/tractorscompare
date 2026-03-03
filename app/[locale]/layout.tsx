import { headers } from 'next/headers';
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { locales } from '@/lib/i18n/config';
import { getAlternates, getCanonicalUrl, logicalPathFromPathname } from '@/lib/i18n/routes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pathname = (await headers()).get('x-pathname') || `/${locale}`;
  const loc = locale as Locale;
  const logicalPath = logicalPathFromPathname(pathname, loc);
  const alternates = getAlternates(logicalPath, loc);
  return {
    alternates: {
      canonical: getCanonicalUrl(logicalPath, loc),
      languages: {
        es: alternates.es,
        en: alternates.en,
        'x-default': alternates['x-default'],
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <Header locale={locale as Locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale as Locale} />
    </>
  );
}
