/**
 * Rutas traducidas: mismo contenido, path segment distinto por idioma.
 * - EN: /en/tractors/[slug], /en/brands, ...
 * - ES: /es/tractores/[slug], /es/marcas, ...
 * El filesystem usa siempre el segmento EN (tractors, brands, ...).
 * Middleware reescribe /es/<segmento-es> -> /es/<segmento-en> para que coincida la ruta.
 *
 * Cómo añadir una nueva ruta con traducciones:
 * 1. Añadir aquí el par en -> es en PATH_SEGMENT_BY_LOCALE (y opcionalmente en ES_TO_EN_FIRST_SEGMENT).
 * 2. Crear la página bajo app/[locale]/<segmento-en>/ (ej. app/[locale]/my-page/page.tsx).
 * 3. Usar pathForLocale('my-page', locale) en LocaleLink o links para generar /es/mi-pagina o /en/my-page.
 */

import type { Locale } from './config';

/** Primera parte de la ruta (path segment) por idioma. Clave = segmento EN (usado en filesystem). */
export const PATH_SEGMENT_BY_LOCALE: Record<string, { es: string; en: string }> = {
  home: { es: '', en: '' },
  tractors: { es: 'tractores', en: 'tractors' },
  brands: { es: 'marcas', en: 'brands' },
  news: { es: 'noticias', en: 'news' },
  compare: { es: 'comparar', en: 'compare' },
  contact: { es: 'contacto', en: 'contact' },
  blog: { es: 'blog', en: 'blog' },
  'about-us': { es: 'sobre-nosotros', en: 'about-us' },
  privacy: { es: 'privacidad', en: 'privacy' },
  terms: { es: 'terminos', en: 'terms' },
  disclaimer: { es: 'disclaimer', en: 'disclaimer' },
  specs: { es: 'specs', en: 'specs' },
  methodology: { es: 'metodologia', en: 'methodology' },
  'data-sources': { es: 'fuentes-datos', en: 'data-sources' },
  used: { es: 'ocasion', en: 'used' },
  offers: { es: 'ofertas', en: 'offers' },
  guides: { es: 'guias', en: 'guides' },
  type: { es: 'tipo', en: 'type' },
  best: { es: 'mejores', en: 'best' },
  'agricultural-tractors': { es: 'tractores-agricolas', en: 'agricultural-tractors' },
  'lawn-garden-tractors': { es: 'tractores-jardin', en: 'lawn-garden-tractors' },
  search: { es: 'buscar', en: 'search' },
};

/** Para middleware: segmento ES (en URL) -> segmento EN (en filesystem). */
export const ES_TO_EN_FIRST_SEGMENT: Record<string, string> = {};
for (const [enSeg, { es: esSeg }] of Object.entries(PATH_SEGMENT_BY_LOCALE)) {
  if (esSeg && esSeg !== enSeg) {
    ES_TO_EN_FIRST_SEGMENT[esSeg] = enSeg;
  }
}

/** Dado el segmento lógico (EN) y el locale, devuelve el path segment para la URL. */
export function pathSegmentForLocale(logicalSegment: string, locale: Locale): string {
  const pair = PATH_SEGMENT_BY_LOCALE[logicalSegment];
  if (!pair) return logicalSegment;
  return locale === 'es' ? pair.es : pair.en;
}

/**
 * Construye href con locale: /<locale>/<path con segmentos traducidos>.
 * logicalPath: path con segmentos EN, ej. "tractors", "tractors/fendt-822", "compare", "best/compact".
 */
export function pathForLocale(logicalPath: string, locale: Locale): string {
  if (!logicalPath.trim()) return `/${locale}`;
  const segments = logicalPath.split('/').filter(Boolean);
  const translated = segments.map((seg, i) => {
    if (i === 0 && PATH_SEGMENT_BY_LOCALE[seg]) {
      return pathSegmentForLocale(seg, locale);
    }
    return seg; // [slug], [brand], [type], etc. se mantienen igual
  });
  return `/${locale}/${translated.join('/')}`;
}

/**
 * Dado el pathname mostrado al usuario (ej. /es/tractores/foo o /en/tractors/foo), devuelve el path lógico EN
 * para generar alternates (tractors/foo).
 */
export function logicalPathFromPathname(pathname: string, locale: Locale): string {
  const withoutLocale = pathname.replace(/^\/[es|en]\/?/i, '').trim();
  if (!withoutLocale) return '';
  const segments = withoutLocale.split('/');
  const first = segments[0];
  if (locale === 'es') {
    const enSeg = ES_TO_EN_FIRST_SEGMENT[first];
    if (enSeg) {
      segments[0] = enSeg;
      return segments.join('/');
    }
  }
  return withoutLocale;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

/**
 * Genera URLs alternates para hreflang (SEO).
 * logicalPath = path con segmentos EN, ej. "", "tractors", "tractors/fendt-822".
 * x-default apunta a la versión EN.
 */

export function getAlternates(
  logicalPath: string,
  locale: Locale
): { 'es': string; 'en': string; 'x-default': string } {
  const esPath = pathForLocale(logicalPath, 'es').replace(/^\/es\/?/, '') || '';
  const enPath = pathForLocale(logicalPath, 'en').replace(/^\/en\/?/, '') || '';
  return {
    'es': esPath ? `${BASE_URL}/es/${esPath}` : `${BASE_URL}/es`,
    'en': enPath ? `${BASE_URL}/en/${enPath}` : `${BASE_URL}/en`,
    'x-default': enPath ? `${BASE_URL}/en/${enPath}` : `${BASE_URL}/en`,
  };
}

/** Canonical para la página actual: BASE_URL + /locale + path traducido. */
export function getCanonicalUrl(logicalPath: string, locale: Locale): string {
  const path = pathForLocale(logicalPath, locale);
  return `${BASE_URL}${path}`;
}
