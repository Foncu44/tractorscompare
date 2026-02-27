import Link from 'next/link';

export interface BreadcrumbsProps {
  /** Brand display name, e.g. "John Deere" */
  brandName: string;
  /** Brand URL slug, e.g. "john-deere" */
  brandSlug: string;
  /** Model display name, e.g. "850" */
  modelName: string;
  /** Tractor page slug for canonical URL in schema, e.g. "john-deere-850" */
  tractorSlug: string;
  /** Full name for the last segment (can be "Brand Model" or include year) */
  currentLabel?: string;
}

const BASE = 'https://tractorscompare.com';

export default function Breadcrumbs({
  brandName,
  brandSlug,
  modelName,
  tractorSlug,
  currentLabel,
}: BreadcrumbsProps) {
  const lastLabel = currentLabel ?? `${brandName} ${modelName}`;
  const tractorUrl = `${BASE}/tractores/${tractorSlug}`;

  const items = [
    { name: 'Home', href: '/' },
    { name: 'Brands', href: '/marcas' },
    { name: brandName, href: `/marcas/${brandSlug}` },
    { name: lastLabel, href: null },
  ];

  const schemaItems = [
    { '@type': 'ListItem' as const, position: 1, name: 'Home', item: BASE },
    { '@type': 'ListItem' as const, position: 2, name: 'Brands', item: `${BASE}/marcas` },
    { '@type': 'ListItem' as const, position: 3, name: brandName, item: `${BASE}/marcas/${brandSlug}` },
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
