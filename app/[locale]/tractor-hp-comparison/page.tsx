import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getAlternates, getCanonicalUrl } from '@/lib/i18n/routes';
import LocaleLink from '@/components/LocaleLink';

const LOGICAL_PATH = 'tractor-hp-comparison';
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

  const title = 'Tractor HP comparison guide: match horsepower to your farm and implements | TractorsCompare';
  const description =
    'Use horsepower data and tractor specs to compare PTO HP, engine HP and drawbar power. Learn how many HP you really need for mowing, loader work and hay on small and mid-size farms.';

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

export default async function TractorHpComparisonPage({
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
        item: { '@id': canonical, name: 'Tractor horsepower comparison' },
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much tractor horsepower do I need for my property?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'For very small properties under 5 acres that only need mowing and light hauling, 20–25 engine HP is usually enough. Mixed-use properties between 5 and 15 acres often work best with 25–40 HP compact tractors that can handle loader work and tillage. Once you regularly pull ground-engaging implements or run hay equipment, 40–75 HP is more realistic. Above that, 75+ HP tractors are aimed at full-time farms with heavier tillage and baling duties.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between engine HP, PTO HP and drawbar HP?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Engine horsepower is the raw power produced at the crankshaft and is what manufacturers usually advertise. PTO horsepower is the power that actually reaches your implements at the PTO shaft and is typically 10–20% lower after transmission and drivetrain losses. Drawbar horsepower measures how much pulling power is available at the hitch for ground work. When comparing tractors, PTO HP is the best reference for matching mowers, tillers and balers, while drawbar HP is more relevant for pulling heavy implements.',
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
            <p className="text-sm text-gray-500 mb-2">Tractor horsepower comparison guide</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tractor HP comparison: choosing the right power for your farm
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Horsepower is one of the first numbers people look at when they compare tractors, but
              it is also one of the most misunderstood. A 40 HP sub‑compact and a 40 HP utility
              tractor can feel completely different in the field. This tractor HP comparison guide
              explains how engine, PTO and drawbar horsepower relate to real tasks and how our
              tractor data platform can help you shortlist models that have enough power without
              overspending on HP you will never use.
            </p>
          </header>

          <article className="prose prose-sm md:prose lg:prose-lg max-w-none text-gray-800">
            <h2>Understanding the different horsepower ratings</h2>
            <p>
              Every modern spec sheet will mention at least engine horsepower and often PTO
              horsepower. Engine HP is measured at the crankshaft and represents the maximum power
              the engine can produce under test conditions. By the time that power passes through
              the transmission and final drive, some of it is lost as heat and mechanical drag. PTO
              HP is what is left at the PTO shaft and is the number you should compare against
              implement requirements for mowers, tillers, balers and snow blowers.
            </p>
            <p>
              Drawbar horsepower is a third rating that focuses on pulling ability. It depends on
              ballast, tyres and weight distribution as well as raw power. Our database tracks these
              ratings so you can see which tractors turn engine power into usable PTO and drawbar
              performance most efficiently instead of assuming that all 100 HP tractors behave the
              same.
            </p>

            <h2>Matching HP bands to property size and tasks</h2>
            <p>
              Rather than chasing the highest horsepower you can afford, it is better to choose a
              tractor that covers your toughest regular task with a margin of safety. For a
              3–5 acre property focused on mowing, snow clearing and light trailer work, 20–30 HP
              compact tractors are usually sufficient. If you regularly load gravel, till vegetable
              ground or run heavier rotary cutters on 10–20 acres, a 35–50 HP compact or small
              utility model is a more realistic band.
            </p>
            <p>
              Operations with 20–50 acres of mixed cropping or hay often step into the 50–90 HP
              range, where heavier loaders, round balers and wider tillage equipment become
              practical. Above that, 100+ HP row‑crop and articulated tractors are aimed at
              full‑time farms with intensive tillage and large implements. On TractorsCompare you
              can filter our tractor data by horsepower band and type, then compare tractors in the
              short list side by side by PTO HP, hydraulic capacity and weight.
            </p>

            <h2>Using data, not guesses, to compare tractor HP</h2>
            <p>
              One of the easiest mistakes to make is comparing only advertised engine HP between
              brands. Two 75 HP tractors can have very different PTO ratings, hydraulic output and
              operating weights. By using a structured tractor data and production database you can
              see how many models exist in each HP class, which ones deliver strong PTO numbers and
              which series dominate in your region. That helps you avoid buying a tractor that looks
              powerful on paper but struggles with your implements.
            </p>
            <p>
              For a broader view of how many tractors are built in each power class over time, see
              our{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-production-database"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor production database
              </LocaleLink>
              . If you want a general introduction to the underlying specification fields, start on
              the{' '}
              <LocaleLink
                locale={loc}
                logicalPath="tractor-data"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                tractor data overview page
              </LocaleLink>
              . When you are ready to work with real models, open the{' '}
              <a
                href="/en/compare-tractors"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                compare tractors tool
              </a>{' '}
              and run concrete tractor HP comparisons using up‑to‑date specifications.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

