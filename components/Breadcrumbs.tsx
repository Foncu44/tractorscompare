import Link from 'next/link';
import { pathForLocale } from '@/lib/i18n/routes';
import type { Locale } from '@/lib/i18n/config';

export interface BreadcrumbsProps {
  brandName: string;
  brandSlug: string;
  modelName: string;
  tractorSlug: string;
  currentLabel?: string;
  /** Si se pasa, los enlaces usan pathForLocale (i18n). */
  locale?: Locale;
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export default function Breadcrumbs({
  brandName,
  brandSlug,
  modelName,
  tractorSlug,
  currentLabel,
  locale,
}: BreadcrumbsProps) {
  const lastLabel = currentLabel ?? `${brandName} ${modelName}`;
  const homeHref = locale ? pathForLocale('', locale) : '/';
  const brandsHref = locale ? pathForLocale('brands', locale) : '/marcas';
  const brandHref = locale ? pathForLocale('brands/' + brandSlug, locale) : `/marcas/${brandSlug}`;
  const tractorPath = locale ? pathForLocale('tractors/' + tractorSlug, locale) : `/tractores/${tractorSlug}`;
  const tractorUrl = tractorPath.startsWith('http') ? tractorPath : `${BASE}${tractorPath}`;

  const items = [
    { name: 'Home', href: homeHref },
    { name: 'Brands', href: brandsHref },
    { name: brandName, href: brandHref },
    { name: lastLabel, href: null },
  ];

  const schemaItems = [
    { '@type': 'ListItem' as const, position: 1, name: 'Home', item: BASE + (locale ? pathForLocale('', locale) : '') },
    { '@type': 'ListItem' as const, position: 2, name: 'Brands', item: BASE + (locale ? pathForLocale('brands', locale) : '/marcas') },
    { '@type': 'ListItem' as const, position: 3, name: brandName, item: BASE + (locale ? pathForLocale('brands/' + brandSlug, locale) : `/marcas/${brandSlug}`) },
    { '@type': 'ListItem' as const, position: 4, name: lastLabel, item: tractorUrl },
  ];

  return (
    <div className="bg-gray-100/60 border-b border-gray-200">
      <div className="container-custom py-3 md:py-4">
        <nav className="text-xs md:text-sm text-gray-600 break-words" aria-label="Breadcrumb">
          {items.map((item, i) => (
            <span key={i}>
              {i > 0 && ' / '}
              {item.href ? (
                <Link href={item.href} className="hover:text-primary-700">
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.name}</span>
              )}
            </span>
          ))}
        </nav>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: schemaItems,
            }),
          }}
        />
      </div>
    </div>
  );
}
