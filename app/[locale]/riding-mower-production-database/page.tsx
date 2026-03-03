import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getAlternates, getCanonicalUrl } from '@/lib/i18n/routes';
import LocaleLink from '@/components/LocaleLink';

const LOGICAL_PATH = 'riding-mower-production-database';
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

  const title = 'Riding Mower Production Database | TractorsCompare';
  const description =
    'Understand how a riding mower production database tracks models, specs and build years so you can compare lawn tractors and zero‑turn riders by data.';

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

export default async function RidingMowerProductionDatabasePage({
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
        item: { '@id': canonical, name: 'Riding Mower Production Database' },
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is stored in a riding mower production database?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'A riding mower production database stores lawn tractor and zero‑turn rider models together with their key specifications—engine family, approximate horsepower, deck width, transmission type and hitch options—as well as production years and series information. That combination lets you see how a mower platform has evolved over time and which models share engines, decks or frames.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is production history useful when buying a riding mower?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Production history helps you judge how easy it will be to service a riding mower over the long term. Long‑running lawn tractor series typically have better parts support, more compatible attachments and a deeper used‑machine pool. A production database makes those patterns visible so you can favour established platforms without guessing from marketing names alone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can a riding mower production database work with tractor data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. When riding mower records are stored in the same schema as tractor data, you can analyse power bands across all equipment on a property and use a common comparison view for lawn tractors, compact tractors and larger farm machines. That makes it easier to balance horsepower, deck width and implement compatibility across your whole fleet.',
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
            <p className="text-sm text-gray-500 mb-2">Riding mower data &amp; production</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Riding Mower Production Database
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Riding mowers sit in the space between walk‑behind equipment and full‑size compact
              tractors. A riding mower production database helps you understand that middle ground
              by tying together specifications and build years for lawn tractors and zero‑turn
              riders. With the data organised, you can compare frames, decks, transmissions and
              power levels instead of buying purely on brand reputation or deck colour.
            </p>
          </header>

          <article className="prose prose-sm md:prose lg:prose-lg max-w-none text-gray-800">
            <h2>What data is included?</h2>
            <p>
              At a minimum, each riding mower record includes engine make and model, approximate
              horsepower, deck width, cutting height range, transmission type, drive configuration
              and fuel type. For lawn tractors that may also cover hitch category for rear
              attachments and information about mid‑mount PTO options. Zero‑turn riders add details
              about hydrostatic systems, wheel motors and frame layout because those elements
              heavily influence comfort and productivity.
            </p>
            <p>
              By storing this information in a consistent schema you can apply the same filters
              across brands. For instance, you might search for 42–54&nbsp;inch riders with
              hydrostatic drive and engines in a particular displacement range, then narrow further
              by turning radius or overall length if storage space is tight. The production database
              guarantees that each record uses the same field definitions so these comparisons are
              meaningful.
            </p>

            <h2>Production years and model history</h2>
            <p>
              On the production side the database records when each riding mower generation
              appeared, which seasons introduced new deck designs or engines and when a series was
              replaced. That history shows how long popular platforms stayed in the catalogue and
              where short‑run experiments appeared. Owners can use that knowledge to steer toward
              models that enjoyed several seasons of refinement and strong dealer support.
            </p>
            <p>
              Grouping mowers into families also clarifies which models are essentially the same
              chassis with different badges or trim levels. A data field linking related riders lets
              you see when a lawn tractor and a zero‑turn share decks or rear frames, which can
              simplify attachment decisions and parts stocking. Without a production database those
              shared foundations are easy to miss.
            </p>

            <h2>Compare models</h2>
            <p>
              A riding mower production database becomes especially powerful when combined with a
              comparison view. Within TractorsCompare you can move from mower‑level records into a
              multi‑model comparison that highlights deck widths, horsepower ratings, transmission
              types and dimensions side by side. That way you can see, for example, how a 42&nbsp;inch
              lawn tractor from one brand stacks up against a 48&nbsp;inch zero‑turn from another in
              terms of power, ground speed and storage footprint.
            </p>
            <p>
              Because riding mowers and tractors share the same underlying data model you can also
              look at them together. The{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor production database
              </LocaleLink>{' '}
              describes larger equipment, while this page focuses on riders. When you are ready to
              evaluate actual tractors, open the{' '}
              <a
                href="/en/compare-tractors"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                compare tractors tool
              </a>{' '}
              to run detailed spec comparisons. For walk‑behind equipment there is also a dedicated{' '}
              <LocaleLink
                locale={loc}
                logicalPath="lawn-mower-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                lawn mower production database
              </LocaleLink>{' '}
              page.
            </p>

            <h2>Popular brands</h2>
            <p>
              A riding mower production database is not a ranking of brands, but it does need to
              represent the manufacturers that buyers encounter most often. Common entries typically
              include:
            </p>
            <ul>
              <li>John&nbsp;Deere lawn tractors and riders used on residential and small farm properties</li>
              <li>Husqvarna riding mowers designed for durability and broad dealer coverage</li>
              <li>Troy‑Bilt lawn tractors widely available through retail channels</li>
              <li>Cub Cadet riders, including a range of zero‑turn models</li>
              <li>Toro lawn tractors and zero‑turn mowers</li>
            </ul>
            <p>
              By treating these brands as data rather than marketing stories, the database lets you
              focus on whether a given model&apos;s horsepower, deck width and transmission layout
              match your property and implements. You can then combine that neutral view with local
              dealer support and pricing to choose the right rider for your situation.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

