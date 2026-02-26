import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientErrorLogger from '@/components/ClientErrorLogger';

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
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://tractorscompare.com" />
        {/* Preload banner image for faster LCP */}
        <link
          rel="preload"
          href="/images/banner.webp"
          as="image"
          type="image/webp"
          media="(max-width: 768px)"
        />
        <link
          rel="preload"
          href="/images/banner.webp"
          as="image"
          type="image/webp"
          media="(min-width: 769px)"
        />
        {/* DNS prefetch para recursos externos comunes */}
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://commons.wikimedia.org" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        {/* Google Analytics - Carga diferida después de interacción del usuario */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5WVZHK0232"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5WVZHK0232', {
              'send_page_view': false
            });
            // Enviar pageview solo después de interacción del usuario
            if (typeof window !== 'undefined') {
              ['mousedown', 'touchstart', 'keydown'].forEach(function(event) {
                document.addEventListener(event, function() {
                  gtag('config', 'G-5WVZHK0232', {
                    'send_page_view': true
                  });
                }, { once: true });
              });
            }
          `}
        </Script>
        {/* AdSense - load directly from Google (no proxy); only in production */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsbygoogle"
            strategy="afterInteractive"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-1428727998918616'}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-serif overflow-x-hidden" suppressHydrationWarning>
        <ClientErrorLogger />
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
        <Analytics />
      </body>
    </html>
  );
}

