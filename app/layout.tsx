import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientErrorLogger from '@/components/ClientErrorLogger';
import ClientErrorReporter from '@/components/ClientErrorReporter';
import AnalyticsScripts from '@/components/AnalyticsScripts';
import VercelAnalyticsSafe from '@/components/VercelAnalyticsSafe';

export const metadata: Metadata = {
  title: {
    default: 'Tractor Data & Specifications Database | TractorsCompare',
    template: '%s | TractorsCompare',
  },
  description: 'Compare 18,000+ tractors by brand, model, engine, transmission, and PTO. Complete tractor specifications database with detailed technical data.',
  keywords: [
    'tractor data',
    'tractor specifications',
    'tractor specs',
    'tractor database',
    'tractor comparison',
    'compare tractors',
    'tractor technical data',
    'tractor information',
    'tractor specs database',
    'agricultural tractor data',
    'farm tractor specifications',
    'tractor specifications database',
    'tractor data lookup',
    'tractor specs lookup',
    'tractor comparison tool',
    'john deere tractor data',
    'kubota tractor specifications',
    'new holland tractor specs',
    'case ih tractor data',
    'massey ferguson tractor specifications',
    'tractor horsepower',
    'tractor engine specifications',
    'tractor transmission specs',
    'tractor pto specifications',
    'tractor hydraulic system',
    'tractor buying guide',
    'best tractor database',
    'tractor information site',
    'tractordata alternative',
    'tractor specs explained',
  ],
  authors: [{ name: 'TractorsCompare' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tractorscompare.com',
    siteName: 'TractorsCompare - Tractor Data & Specifications',
    title: 'Tractor Data - Complete Tractor Specifications Database | TractorsCompare',
    description: 'Comprehensive tractor data and specifications database. Compare over 18,000 tractors with detailed technical information, engine specs, transmission, PTO and hydraulic system data for all major brands.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tractor Data - Complete Tractor Specifications | TractorsCompare',
    description: 'Tractor data and specifications database with detailed technical information for all major brands. Compare tractors, find specs, and get comprehensive tractor data.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Favicon: data URI evita 404 si no existe /public/favicon.ico */}
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='24' font-size='24'%3E🚜%3C/text%3E%3C/svg%3E" />
        <link rel="canonical" href="https://tractorscompare.com" />
        <meta name="google-adsense-account" content="ca-pub-1428727998918616" />
        {/* Preload banner image for faster LCP */}
        <link
          rel="preload"
          href="/images/banner.webp"
          as="image"
        />
        {/* DNS prefetch para recursos externos comunes */}
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://commons.wikimedia.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* AdSense: <script> nativo en <head> (sin next/script) para evitar data-nscript y "AdSense head tag doesn't support data-nscript". */}
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1428727998918616"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-serif overflow-x-hidden" suppressHydrationWarning>
        <ClientErrorLogger />
        {process.env.NEXT_PUBLIC_DEBUG_ERRORS === 'true' && <ClientErrorReporter />}
        <AnalyticsScripts />
        {/* JSON-LD - suppressHydrationWarning evita el warning de hidratación */}
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
              publisher: {
                '@type': 'Organization',
                name: 'TractorsCompare',
                url: 'https://tractorscompare.com',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tractorscompare.com/buscar?q={search_term_string}',
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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <VercelAnalyticsSafe />
      </body>
    </html>
  );
}

