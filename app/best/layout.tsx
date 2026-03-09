import { headers } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Locale } from '@/lib/i18n/config';

/**
 * Cuando se accede a /best/[...] por rewrite desde /[locale]/best/[...],
 * el middleware envía x-locale. Mostramos Header y Footer con ese idioma.
 */
export default async function BestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get('x-locale') as Locale | null;
  if (!locale || (locale !== 'es' && locale !== 'en')) {
    return <>{children}</>;
  }
  return (
    <>
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
