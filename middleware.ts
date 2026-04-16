import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultLocale, isValidLocale } from '@/lib/i18n/config';
import { ES_TO_EN_FIRST_SEGMENT, PATH_SEGMENT_BY_LOCALE } from '@/lib/i18n/routes';

/**
 * i18n middleware (SEO-safe):
 * - / -> redirect a /en (no usar Accept-Language para bots).
 * - /es/<segmento-es> -> rewrite a /es/<segmento-en> para que coincida la ruta en app/[locale]/.
 * - /en/* -> sin rewrite.
 * - Rutas sin prefijo de idioma (ej. /tractores) -> redirect a /en/tractors.
 * Cabecera x-locale para que el layout raíz pueda poner <html lang="...">.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // No tocar assets, API, _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/ads.txt' ||
    pathname === '/robots.txt' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Raíz: redirect permanente a /en (308 para consolidar link equity en Google)
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    const res = NextResponse.redirect(url, 308);
    res.headers.set('x-pathname', url.pathname);
    res.headers.set('x-locale', defaultLocale);
    return res;
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  // Ya tiene locale válido
  if (isValidLocale(first)) {
    const locale = first as 'es' | 'en';
    const rest = segments.slice(1);
    const newUrl = request.nextUrl.clone();

    // Para ES: reescribir primer segmento (español -> inglés) para que coincida con app/[locale]/<en-path>
    if (locale === 'es' && rest.length > 0) {
      const esSegment = rest[0];
      const enSegment = ES_TO_EN_FIRST_SEGMENT[esSegment];
      if (enSegment) {
        rest[0] = enSegment;
        newUrl.pathname = `/${locale}/${rest.join('/')}`;
        const res = NextResponse.rewrite(newUrl);
        res.headers.set('x-locale', locale);
        res.headers.set('x-pathname', pathname);
        return res;
      }
    }

    // [locale]/brands/[brand] no existe: reescribir a /marcas/[brand] y enviar x-locale (layout raíz mostrará Header/Footer)
    if (rest[0] === 'brands' && rest.length > 1) {
      const tail = rest.slice(1).join('/');
      newUrl.pathname = `/marcas/${tail}`;
      const res = NextResponse.rewrite(newUrl);
      res.headers.set('x-locale', locale);
      res.headers.set('x-pathname', pathname);
      return res;
    }

    // [locale]/best/[category] no existe: reescribir a /best/[category] y enviar x-locale
    if (rest[0] === 'best' && rest.length > 1) {
      const tail = rest.slice(1).join('/');
      newUrl.pathname = `/best/${tail}`;
      const res = NextResponse.rewrite(newUrl);
      res.headers.set('x-locale', locale);
      res.headers.set('x-pathname', pathname);
      return res;
    }

    const res = NextResponse.next();
    res.headers.set('x-locale', locale);
    res.headers.set('x-pathname', pathname);
    return res;
  }

  // Sin locale: redirect permanente a /en/<path-en> (308 para consolidar link equity)
  const rest = segments.slice(1);
  const enFirst = ES_TO_EN_FIRST_SEGMENT[first] ?? (PATH_SEGMENT_BY_LOCALE[first] ? PATH_SEGMENT_BY_LOCALE[first].en : first);
  const pathEn = rest.length > 0 ? [enFirst, ...rest].join('/') : enFirst;
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}/${pathEn}`;
  const res = NextResponse.redirect(url, 308);
  res.headers.set('x-pathname', url.pathname);
  res.headers.set('x-locale', defaultLocale);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
