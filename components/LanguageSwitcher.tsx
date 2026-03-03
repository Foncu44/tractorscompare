'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';
import { pathForLocale } from '@/lib/i18n/routes';
import { ES_TO_EN_FIRST_SEGMENT } from '@/lib/i18n/routes';
import { PATH_SEGMENT_BY_LOCALE } from '@/lib/i18n/routes';

/**
 * Convierte el pathname actual (ej. /es/tractores/foo) al path equivalente en el otro idioma (ej. /en/tractors/foo).
 */
function getOtherLocalePath(pathname: string, currentLocale: Locale): string {
  const otherLocale: Locale = currentLocale === 'es' ? 'en' : 'es';
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'es' && segments[0] !== 'en') return `/${otherLocale}`;
  const rest = segments.slice(1);
  if (rest.length === 0) return `/${otherLocale}`;
  const first = rest[0];
  let logicalFirst: string;
  if (currentLocale === 'es') {
    logicalFirst = ES_TO_EN_FIRST_SEGMENT[first] ?? first;
  } else {
    const pair = Object.entries(PATH_SEGMENT_BY_LOCALE).find(([, v]) => v.en === first);
    logicalFirst = pair ? pair[0] : first;
  }
  const logicalPath = [logicalFirst, ...rest.slice(1)].filter(Boolean).join('/');
  return pathForLocale(logicalPath, otherLocale);
}

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const otherHref = getOtherLocalePath(pathname, locale);
  const otherLabel = locale === 'es' ? 'English' : 'Español';

  return (
    <Link
      href={otherHref}
      className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors"
      aria-label={otherLabel}
    >
      {otherLabel}
    </Link>
  );
}
