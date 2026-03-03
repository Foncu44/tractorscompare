'use client';

import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { pathForLocale } from '@/lib/i18n/routes';

/**
 * Link que antepone el locale y traduce el primer segmento de la ruta.
 * logicalPath = path con segmentos EN, ej. "tractors", "tractors/fendt-822", "compare".
 * Si se pasa logicalPath, href puede omitirse.
 */
export default function LocaleLink({
  href,
  locale,
  logicalPath,
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'href'> & {
  locale: Locale;
  href?: string;
  /** Path lógico (segmentos EN). Si se pasa, se usa para generar /locale/... */
  logicalPath?: string;
}) {
  const path = logicalPath !== undefined ? pathForLocale(logicalPath, locale) : (href ?? '#');
  return <Link href={path} {...props} />;
}
