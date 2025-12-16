import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'TractorsCompare - Comparador de Tractores y Especificaciones',
    template: '%s | TractorsCompare',
  },
  description: 'Compara especificaciones de tractores agrícolas, de jardín e industriales. Encuentra el tractor perfecto con nuestro comparador de más de 18,000 modelos.',
  keywords: ['tractores', 'comparador tractores', 'especificaciones tractores', 'tractores agrícolas', 'john deere', 'kubota', 'new holland', 'case ih'],
  authors: [{ name: 'TractorsCompare' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://tractorscompare.com',
    siteName: 'TractorsCompare',
    title: 'TractorsCompare - Comparador de Tractores',
    description: 'Compara especificaciones de tractores agrícolas, de jardín e industriales',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TractorsCompare - Comparador de Tractores',
    description: 'Compara especificaciones de tractores agrícolas',
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
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://tractorscompare.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'TractorsCompare',
              url: 'https://tractorscompare.com',
              description: 'Comparador de tractores y especificaciones técnicas',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tractorscompare.com/buscar?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

