import './globals.css';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import ClientErrorLogger from '@/components/ClientErrorLogger';
import ClientErrorReporter from '@/components/ClientErrorReporter';
import AnalyticsScripts from '@/components/AnalyticsScripts';
import VercelAnalyticsSafe from '@/components/VercelAnalyticsSafe';

export const metadata: Metadata = {
  title: {
    default: 'TractorsCompare – Tractor Database & Specifications for 10,000+ Models',
    template: '%s | TractorsCompare',
  },
  description:
    'Free tractor database with detailed specifications for over 10,000 agricultural, lawn, and industrial tractors. Compare horsepower, engine specs, dimensions, and prices across all major brands.',
  keywords: [
    'tractor database', 'tractor specifications', 'tractor data', 'tractordata',
    'tractor comparison', 'tractor comparison tool', 'compare tractors',
    'tractor specs', 'tractor horsepower', 'tractor dimensions',
    'agricultural tractors', 'farm tractors', 'lawn tractors',
    'John Deere specs', 'Kubota specs', 'New Holland specs',
    'tractor price comparison', 'tractor weight', 'tractor engine',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tractorscompare.com',
    siteName: 'TractorsCompare',
    title: 'TractorsCompare – Tractor Database & Specifications',
    description: 'Compare 10,000+ tractors side by side. Free specs, horsepower data, dimensions, and pricing for every major brand.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TractorsCompare – Tractor Database & Specifications',
    description: 'Compare 10,000+ tractors side by side. Free specs, horsepower data, dimensions, and pricing for every major brand.',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

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
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&display=swap"
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
            data-ad-frequency-hint="30s"
          />
        )}
      </head>
      <body className="font-sans text-stone-900 bg-surface-warm overflow-x-hidden antialiased" suppressHydrationWarning>
        <ClientErrorLogger />
        {process.env.NEXT_PUBLIC_DEBUG_ERRORS === 'true' && <ClientErrorReporter />}
        <AnalyticsScripts />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'TractorsCompare',
                alternateName: ['TractorsCompare', 'Tractors Compare', 'Tractor Database'],
                url: 'https://tractorscompare.com',
                description: 'Free tractor database with specs for 10,000+ agricultural, lawn and industrial tractors.',
                inLanguage: ['en', 'es'],
                publisher: { '@type': 'Organization', name: 'TractorsCompare', url: 'https://tractorscompare.com' },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://tractorscompare.com/en/search?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'TractorsCompare',
                url: 'https://tractorscompare.com',
                logo: 'https://tractorscompare.com/images/banner.webp',
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  availableLanguage: ['English', 'Spanish'],
                },
                sameAs: [],
              },
            ]),
          }}
        />
        {children}
        <VercelAnalyticsSafe />
      </body>
    </html>
  );
}

