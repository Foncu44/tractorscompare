import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getAlternates, getCanonicalUrl } from '@/lib/i18n/routes';
import LocaleLink from '@/components/LocaleLink';

const LOGICAL_PATH = 'tractor-data';
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

  const title = 'Tractor data: complete tractor specifications database | TractorsCompare';
  const description =
    'Learn how to use tractor data to compare models by horsepower, engine, transmission, PTO and hydraulics. Explore how a structured tractor data platform helps farmers, dealers and analysts make better decisions.';

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

export default async function TractorDataPage({
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
        item: {
          '@id': `${BASE_URL}/en`,
          name: 'Home',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@id': canonical,
          name: 'Tractor data',
        },
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is tractor data and why does it matter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Tractor data is the structured set of specifications, ratings and test results that describe how a tractor is built and how it performs in the field. When it is stored in a consistent database you can filter models by horsepower band, PTO output, hydraulic capacity or transmission type, compare tractors side by side and quickly shortlist the models that truly fit your farm tasks instead of relying on marketing brochures or anecdotal advice.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which tractor data fields are most important when comparing models?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'The most useful tractor data points for comparison are engine horsepower, PTO horsepower, transmission type, hydraulic flow and lift capacity, rear hitch category, operating weight and wheelbase. Together with dimensions these numbers tell you how much work a tractor can realistically do, which implements it can power, how stable it will feel with a loader fitted and whether it will physically fit through gates, sheds and transport trailers on your property.',
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
            <p className="text-sm text-gray-500 mb-2">Tractor data &amp; specifications</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tractor data: how to turn raw specifications into better tractor decisions
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              When people talk about “tractor data” they usually mean a mix of specification
              sheets, test results and real‑world performance notes scattered across brochures,
              forums and PDF manuals. On TractorsCompare we treat tractor data as a structured
              database: more than 18,000 tractors indexed by brand, model, horsepower, PTO rating,
              transmission, hydraulics, dimensions and weight so you can compare tractors rather
              than guess which one might work on your farm.
            </p>
          </header>

          <article className="prose prose-sm md:prose lg:prose-lg max-w-none text-gray-800">
            <h2>What exactly lives inside a tractor data platform?</h2>
            <p>
              A useful tractor data layer starts with the familiar specification blocks: engine
              type and displacement, advertised horsepower, transmission configuration, PTO output
              and hydraulic flow. To be genuinely helpful those fields need to be normalised across
              brands. That means recording horsepower as comparable values, using consistent labels
              for transmission families, mapping fuel types and cooling systems, and keeping drawbar
              and PTO ratings in the same units so that side‑by‑side comparisons are fair.
            </p>
            <p>
              Beyond the engine bay the database should also describe how the tractor behaves in the
              field. Weight, wheelbase, tyre sizes and hitch category influence traction, stability
              and soil compaction. Lift capacity and hydraulic flow tell you whether the loader will
              feel responsive or lazy. Production years and series information help you understand
              where a model sits in the manufacturer&apos;s lineup and which newer or older tractors
              share components.
            </p>

            <h2>Using tractor data to filter a long list of models</h2>
            <p>
              Most buyers start with a very broad search: “compact tractor for 10 acres” or “100 HP
              loader tractor”. A structured tractor data backend lets you express that intent as
              filters: engine horsepower ranges, tractor type, drive configuration, PTO category and
              weight bands. Instead of reading dozens of spec sheets manually you can narrow the
              database to a short list of tractors that meet your minimum PTO power and hydraulic
              requirements and then compare them directly.
            </p>
            <p>
              On TractorsCompare this usually means applying a horsepower band, selecting a type
              such as agricultural, utility or lawn tractor, then drilling into individual models.
              From there you can open the full tractor specification page, where suitability scores
              and narrative analysis help interpret the numbers, and use the comparison tool to see
              how two or more tractors differ in PTO horsepower, transmission, hydraulic capacity
              and operating weight.
            </p>

            <h2>From tractor data to real tractor choices</h2>
            <p>
              Tractor data on its own does not choose a machine for you, but it does remove a lot of
              uncertainty. A farmer who understands the minimum PTO horsepower required for a
              baler, the lift capacity needed for their loader work and the width limits of their
              sheds can overlay those constraints on the database and immediately see which models
              are a good match. That short list then becomes the basis for dealer quotes, test
              drives and financing conversations instead of starting from brand loyalty alone.
            </p>
            <p>
              If you want to go deeper into how many units of each model were built and how the
              market has shifted by power band, visit the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor production database
              </LocaleLink>{' '}
              page. To focus specifically on power and match tractors to property size, head to our{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-hp-comparison"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor horsepower comparison guide
              </LocaleLink>
              . When you are ready to see concrete models side by side, open the{' '}
              <a
                href="/en/compare-tractors"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                compare tractors tool
              </a>{' '}
              to run real comparisons using the underlying database.
            </p>

            <h2>Related mower databases</h2>
            <p>
              The same principles that make tractor data useful also apply to mowing equipment. If
              you manage a fleet that mixes tractors with walk‑behind or zero‑turn mowers, it is
              worth exploring the dedicated mower production databases. For push and self‑propelled
              machines, see the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="lawn-mower-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Lawn Mower Production Database
              </LocaleLink>
              . For lawn tractors and zero‑turn riders, visit the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="riding-mower-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Riding Mower Production Database
              </LocaleLink>
              , which focuses on riding equipment while still following the same data structure as
              the tractor pages.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

