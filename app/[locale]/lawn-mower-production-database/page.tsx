import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getAlternates, getCanonicalUrl } from '@/lib/i18n/routes';
import LocaleLink from '@/components/LocaleLink';

const LOGICAL_PATH = 'lawn-mower-production-database';
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

  const title = 'Lawn Mower Production Database | TractorsCompare';
  const description =
    'Explore how a lawn mower production database organises models, specs and build years so you can compare walk‑behind and zero‑turn mowers confidently.';

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

export default async function LawnMowerProductionDatabasePage({
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
        item: { '@id': canonical, name: 'Lawn Mower Production Database' },
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a lawn mower production database?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'A lawn mower production database is a structured catalogue of mower models that records specifications together with production years, series information and sometimes regional availability. Instead of reading brochures one by one, you can see which walk‑behind and zero‑turn mowers share engines or decks, when a series entered and left the market and how many related models exist across different power bands.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can a lawn mower production database help me choose equipment?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'When mower data is organised in a production database you can filter models by cut width, engine family and approximate power, then check which series ran for long periods and have replacement decks, blades and spindles widely available. That reduces the risk of buying an orphaned design and helps owners and dealers plan long‑term parts support.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between a mower specs page and a production database?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'A single specifications page tells you about one mower in isolation. A production database stores hundreds or thousands of lawn mower records in a consistent format so that you can search by power band, deck width, transmission type and production years, then compare multiple models side by side. It is the difference between a single brochure and a searchable catalogue.',
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
            <p className="text-sm text-gray-500 mb-2">Mower data &amp; production context</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lawn Mower Production Database
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Behind every walk‑behind or zero‑turn mower there is a stream of part numbers, model
              updates and production decisions. A lawn mower production database brings that story
              together in one place: recording which engines, decks and transmissions a mower uses,
              when the model was built and how it relates to the rest of the manufacturer&apos;s
              lineup. Combined with clean specification data it becomes a powerful tool for anyone
              comparing mowers for residential or commercial work.
            </p>
          </header>

          <article className="prose prose-sm md:prose lg:prose-lg max-w-none text-gray-800">
            <h2>What data is included?</h2>
            <p>
              A useful lawn mower production database always starts with the familiar specification
              fields: engine make and model, approximate horsepower, deck width, cutting height
              range, drive configuration and transmission type. For walk‑behind mowers that might
              mean recording whether the unit is push or self‑propelled, how many forward speeds it
              offers and whether the deck supports bagging, mulching or side discharge. For
              commercial zero‑turns you might add hydrostatic pump and motor families, tyre sizes
              and rated ground speed.
            </p>
            <p>
              To make the data genuinely comparable those fields have to be normalised across
              brands. That means using a consistent way of naming engine families, deck sizes and
              transmission layouts and storing cutting widths in the same units. Once that work is
              done you can filter the database for, say, 21–22&nbsp;inch residential mowers with
              self‑propelled drive, or 48–60&nbsp;inch commercial zero‑turns with fabricated decks,
              and have confidence that the results all share the same core attributes.
            </p>

            <h2>Production years and model history</h2>
            <p>
              On the production side the database tracks when each lawn mower model was introduced,
              which years saw major revisions and when it left the catalogue. That timeline helps
              you spot long‑running series that have accumulated plenty of real‑world feedback as
              well as newer designs that might offer improved ergonomics or emissions performance.
              It also highlights short‑lived variants that could be harder to support with decks,
              spindles or control linkages a decade from now.
            </p>
            <p>
              By grouping models into families and series you can see how a particular mower
              platform has evolved. For example, a brand might take an established 48&nbsp;inch
              chassis and release updated engine options over several seasons while keeping the deck
              and transmission architecture largely unchanged. A production database makes those
              relationships explicit so that owners and dealers know which parts and attachments can
              be shared across machines.
            </p>

            <h2>Compare models</h2>
            <p>
              The real value appears when you move from browsing individual records to comparing
              models. Because the lawn mower production database stores specifications in a
              consistent format, you can quickly assemble a shortlist of, for example, 42–54&nbsp;inch
              zero‑turn mowers with similar horsepower and then compare deck construction, drive
              systems and ergonomics side by side. That is much more precise than relying on
              marketing language like “residential pro” or “commercial duty”.
            </p>
            <p>
              On TractorsCompare, tractor and mower data live in the same ecosystem as the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor production database
              </LocaleLink>
              . When you are ready to evaluate specific tractors you can open the{' '}
              <a
                href="/en/compare-tractors"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                compare tractors tool
              </a>{' '}
              and apply the same comparison mindset to horsepower, PTO output and hydraulic
              capacity. For riding equipment specifically, you can also read the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="riding-mower-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                riding mower production database
              </LocaleLink>{' '}
              page, which focuses on tractor‑style mowers.
            </p>

            <h2>Popular brands</h2>
            <p>
              A production database does not pick favourites, but it does need to cope with the
              brands users are most likely to encounter. In the lawn mower space that usually
              includes a mix of premium and value‑oriented manufacturers as well as electric
              specialists. Typical entries you might see represented include:
            </p>
            <ul>
              <li>Honda walk‑behind mowers built around their well‑known small engines</li>
              <li>Toro residential and professional walk‑behinds and zero‑turn models</li>
              <li>John&nbsp;Deere walk‑behind and lawn tractors that share technology with their larger machines</li>
              <li>Craftsman and Troy‑Bilt value mowers sold through big‑box retailers</li>
              <li>Hustler and Wright commercial units focused on zero‑turn productivity</li>
              <li>Battery‑powered ranges from brands such as EGO</li>
            </ul>
            <p>
              The goal is not to rate one brand above another but to give you a neutral view of how
              each model fits into its manufacturer&apos;s lineup and how long similar machines have
              been in production. With that context you can combine online reviews and dealer
              support information with hard data to decide which mower family makes sense for your
              yard or business.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

