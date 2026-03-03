import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getAlternates, getCanonicalUrl } from '@/lib/i18n/routes';
import LocaleLink from '@/components/LocaleLink';

const LOGICAL_PATH = 'tractor-production-database';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tractorscompare.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const canonical = getCanonicalUrl(LOGICAL_PATH, loc);
  const alternates = getAlternates(LOGICAL_PATH, loc);

  const title = 'Tractor production database: model history, volumes and power trends | TractorsCompare';
  const description =
    'See how a tractor production database connects model specifications with production years, power bands and market trends. Learn how farmers and analysts use production data alongside tractor specs to plan fleets and investments.';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: alternates.es,
        en: alternates.en,
        'x-default': alternates['x-default'],
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'TractorsCompare',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function TractorProductionDatabasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const canonical = getCanonicalUrl(LOGICAL_PATH, loc);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: { '@id': `${BASE_URL}/en`, name: 'Home' },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: { '@id': canonical, name: 'Tractor production database' },
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a tractor production database?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'A tractor production database combines model specifications with production metadata such as build years, power class, market region and in some cases estimated unit counts. Instead of only seeing specs for a single model, you can understand how it fits into a broader generation of tractors, which power bands grew or shrank over time and how quickly manufacturers responded to demand for higher horsepower or more compact machines.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can farmers and analysts use tractor production data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Farmers use production data to estimate how easy it will be to source parts, attachments and used machines for a given tractor family, while analysts look at power-band trends, regional mix and brand share to understand how the market is shifting. When you join tractor production figures with a clean specification database you can answer questions like “how many 150–200 HP tractors did this brand ship in the last decade?” or “which models matching my spec still have strong used-market volume?”.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="py-10 md:py-16 bg-white">
        <div className="container-custom max-w-5xl">
          <header className="mb-8">
            <p className="text-sm text-gray-500 mb-2">Tractor production &amp; market data</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Building a tractor production database around your specification data
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              A tractor production database takes the idea of a specification catalogue one step
              further. Instead of only listing horsepower, transmission and hydraulic numbers for
              each model, it records when a tractor entered and left production, which regions it
              was sold into and how many units were built in each power band. When these timelines
              are linked back to a clean tractor data layer you can see not only what a tractor is,
              but how common it is in the real world and how the market has evolved around it.
            </p>
          </header>

          <article className="prose prose-sm md:prose lg:prose-lg max-w-none text-gray-800">
            <h2>From static spec sheets to living production history</h2>
            <p>
              Traditional spec books freeze a tractor model at a single point in time. A production
              database instead treats each tractor as a record with life‑cycle events: launch year,
              facelifts, engine updates, emissions changes and end‑of‑production dates. When you
              store that information alongside engine and PTO horsepower, transmission families and
              hydraulic options, it becomes possible to answer questions like which years offered
              the most reliable engines or when a manufacturer introduced CVT into a given power
              class.
            </p>
            <p>
              For fleets and large farms this is especially powerful. Knowing which tractors share
              a common rear axle or transmission lets you rationalise parts stock. Understanding how
              long a series stayed in production helps you gauge long‑term support and used‑market
              availability. All of these insights start with simple, consistent tractor production
              records keyed by model slug and series.
            </p>

            <h2>What can you analyse with tractor production data?</h2>
            <p>
              Once production volumes are structured by year and horsepower range you can explore
              how quickly demand has shifted toward higher‑power tractors or compact utility
              machines. You might find, for example, that registrations in the 240+ HP band have
              grown while mid‑range 80–140 HP models held steady, or that sub‑compact lawn tractors
              peaked in a particular decade. Combining this with a specification database lets you
              build charts of total installed horsepower on farms, typical power mixes by region and
              even the density of loader‑ready tractors in a given county.
            </p>
            <p>
              Dealers and manufacturers can also use tractor production data for network planning
              and product strategy. Large pockets of older, low‑horsepower tractors might signal an
              opportunity for compact replacements, whereas areas saturated with high‑horsepower
              row‑crop machines may call for specialised service capacity instead. Because each
              record carries both specs and production context, the same database can serve farmers,
              analysts and OEM teams without duplication.
            </p>

            <h2>Connecting production data to real tractor research</h2>
            <p>
              On its own, a tractor production database is an interesting chart. Paired with model‑
              level tractor data it becomes a practical research tool. A farmer comparing candidates
              for a 150 HP loader tractor can filter to models in that band, then use production
              figures to avoid orphaned designs with very short runs or limited regional support.
              Policy makers can study how quickly higher‑efficiency engines replaced older fleets in
              specific horsepower classes. Market analysts can model the likely replacement cycle
              for tractors sold fifteen or twenty years ago.
            </p>
            <p>
              If you want a refresher on the underlying specification layer, start with the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-data"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor data guide
              </LocaleLink>
              . To focus specifically on horsepower bands and how to match them to different
              property sizes, move on to our{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-hp-comparison"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor HP comparison page
              </LocaleLink>
              . When you are ready to test specific tractor models, open the{' '}
              <a
                href="/en/compare-tractors"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                compare tractors tool
              </a>{' '}
              and turn production insights into concrete comparisons.
            </p>

            <h2>Related databases</h2>
            <p>
              Production analysis does not stop at tractors. Many fleets also include walk‑behind
              mowers, zero‑turn units and lawn tractors, so it makes sense to track those machines
              in a similar way. For detailed information about push mowers and commercial
              walk‑behinds, see the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="lawn-mower-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Lawn Mower Production Database
              </LocaleLink>
              . If you are working with lawn tractors and zero‑turn riders, visit the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="riding-mower-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Riding Mower Production Database
              </LocaleLink>{' '}
              page for production‑focused coverage of riding equipment.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

