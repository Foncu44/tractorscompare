import './globals.css';
import { headers } from 'next/headers';
import ClientErrorLogger from '@/components/ClientErrorLogger';
import ClientErrorReporter from '@/components/ClientErrorReporter';
import AnalyticsScripts from '@/components/AnalyticsScripts';
import VercelAnalyticsSafe from '@/components/VercelAnalyticsSafe';

/** Layout raíz: html/lang según x-locale (middleware). Canonical/hreflang se generan en app/[locale]/layout. */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await headers()).get('x-locale') || 'en';
  return (
    <html lang={locale} data-scroll-behavior="smooth" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        />
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='24'%3E🚜%3C/text%3E%3C/svg%3E" />
        <meta name="google-adsense-account" content="ca-pub-1428727998918616" />
        <link rel="preload" href="/images/banner.webp" as="image" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://commons.wikimedia.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1428727998918616"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-sans text-gray-900 bg-gray-50/80 overflow-x-hidden antialiased" suppressHydrationWarning>
        <ClientErrorLogger />
        {process.env.NEXT_PUBLIC_DEBUG_ERRORS === 'true' && <ClientErrorReporter />}
        <AnalyticsScripts />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TractorsCompare - Tractor Data & Specifications',
              alternateName: 'TractorsCompare',
              url: 'https://tractorscompare.com',
              description: 'Complete tractor data, specifications, and technical information database. Compare over 18,000 agricultural, lawn and industrial tractors with detailed technical data.',
              publisher: { '@type': 'Organization', name: 'TractorsCompare', url: 'https://tractorscompare.com' },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tractorscompare.com/en/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              mainEntity: {
                '@type': 'ItemList',
                name: 'Tractor Database',
                description: 'Comprehensive database of tractor specifications and technical data',
                numberOfItems: 18000,
              },
            }),
          }}
        />
        {children}
        <VercelAnalyticsSafe />
      </body>
    </html>
  );
}

