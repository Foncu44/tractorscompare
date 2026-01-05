import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Tractor Data - Complete Tractor Specifications & Database',
    template: '%s | Tractor Data',
  },
  description: 'Tractor data and specifications database. Compare over 18,000 tractors with detailed technical information, specifications, and performance data for all major brands.',
  keywords: ['tractor data', 'tractor specifications', 'tractor database', 'tractor compare', 'tractor information', 'tractor specs', 'tractors', 'john deere', 'kubota', 'new holland', 'case ih'],
  authors: [{ name: 'TractorsCompare' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tractorscompare.com',
    siteName: 'Tractor Data',
    title: 'Tractor Data - Complete Tractor Specifications Database',
    description: 'Comprehensive tractor data and specifications database. Compare over 18,000 tractors with detailed technical information.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tractor Data - Complete Tractor Specifications',
    description: 'Tractor data and specifications database with detailed technical information for all major brands',
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://tractorscompare.com" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5WVZHK0232"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5WVZHK0232');
          `}
        </Script>
        {/* AdSense script - usando script normal para evitar data-nscript */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1428727998918616"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-serif" suppressHydrationWarning>
        {/* JSON-LD - suppressHydrationWarning evita el warning de hidratación */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Tractor Data',
              url: 'https://tractorscompare.com',
              description: 'Complete tractor data, specifications, and technical information database',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tractorscompare.com/buscar?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

