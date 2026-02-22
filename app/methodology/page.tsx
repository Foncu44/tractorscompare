import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TractorFit™ Methodology – How We Score Tractors',
  description:
    'How TractorFit™ scores are calculated: small-farm fit, loader work, fuel efficiency, maintenance complexity, versatility, and power-to-weight. Rule-based, no subjective inputs.',
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container-custom py-8 md:py-12 max-w-3xl">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Methodology</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          TractorFit™ Methodology
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          TractorFit™ scores are computed only from published tractor specifications. There are no
          subjective or random inputs. The same tractor always gets the same scores. This page
          explains the main rules we use so you can interpret the numbers and compare models fairly.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Overall score (0–100)</h2>
          <p className="text-gray-700 mb-4">
            The overall TractorFit™ score is a weighted combination of the sub-scores below. Weights
            are fixed and favor a balanced profile: small-farm fit, large-farm fit, loader
            capability, fuel efficiency, maintenance ease (inverse of complexity), versatility, cost
            tier, and power-to-weight. All sub-scores are clamped to 0–100 before combining.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Sub-scores and rules</h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Small-farm suitability</h3>
          <p className="text-gray-700 mb-4">
            Best for smaller operations when engine power is in a “sweet spot” (roughly 35–65 HP)
            and operating weight is moderate (e.g. under about 2.5 t). Higher HP (e.g. above 90) and
            heavier weight reduce the score because of maneuverability and running costs. Units:
            power in HP, weight in kg.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Large-farm suitability</h3>
          <p className="text-gray-700 mb-4">
            Driven by engine power (HP), hydraulic pump flow (L/min), rear lift capacity (kg), and
            PTO power relative to engine. Higher power, flow, and lift increase the score. Typical
            reference bands: e.g. 150 L/min pump flow and 5,000 kg lift map toward the top of the
            scale. Missing data is treated with safe defaults so scores remain comparable.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Loader work efficiency</h3>
          <p className="text-gray-700 mb-4">
            Combines operating weight, hydraulic pump flow (L/min), rear lift capacity (kg), and
            optional front lift capacity (kg). Weight and flow are strong drivers; rear and front
            lift contribute with defined caps. Relationship is linear within bands and then clamped
            to 0–100.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Fuel efficiency index</h3>
          <p className="text-gray-700 mb-4">
            Uses engine type (diesel preferred, electric highest), power-to-weight (HP per metric
            ton), and displacement per HP where available. Better power-to-weight and efficient
            displacement per HP increase the score. Diesel gets a fixed bonus over gasoline; electric
            gets a higher bonus.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Maintenance complexity</h3>
          <p className="text-gray-700 mb-4">
            Based on transmission type only (no proprietary data). Manual is lowest complexity,
            then powershift, hydrostatic, and CVT highest. Optional gear count can add a small
            adjustment for very high-speed manual transmissions. Result is clamped 0–100 (higher =
            more complex; we often show “ease” as 100 minus this value).
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Versatility index</h3>
          <p className="text-gray-700 mb-4">
            Reflects PTO options (multiple speeds, front PTO), number of hydraulic valves, and PTO
            power relative to engine. More PTO flexibility and more valves increase the score;
            single-speed PTO and few valves limit it.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Power-to-weight</h3>
          <p className="text-gray-700 mb-4">
            Computed as engine power (HP) divided by operating weight in metric tons. The ratio is
            normalized to a 0–100 scale using a fixed band (e.g. typical range ~15–80 HP/t). Higher
            power-to-weight favors drawbar work and responsiveness; weight in kg is used with a
            safe default if missing.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Units and missing data</h2>
          <p className="text-gray-700 mb-4">
            We normalize to consistent units: power in HP, weight in kg, hydraulic flow in L/min,
            lift in kg. If a spec is missing, we use conservative defaults (e.g. estimated weight or
            flow) so that tractors with incomplete data do not get inflated scores. When
            manufacturer data is updated, we recalculate so that scores stay reproducible.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Pros, cons, and expert summary</h2>
          <p className="text-gray-700 mb-4">
            Pros and cons are generated from the same thresholds as the scores (e.g. “good loader
            performance” when loader score is above a set level). The expert summary is a
            template-based, 200–300 word explanation that references the sub-scores and key specs;
            it is fully deterministic and does not use randomness or subjective language.
          </p>
        </section>

        <p className="text-gray-600 text-sm">
          <Link href="/data-sources" className="text-primary-600 hover:underline">Data sources</Link>
          {' · '}
          <Link href="/tractores" className="text-primary-600 hover:underline">Tractor database</Link>
          {' · '}
          <Link href="/best" className="text-primary-600 hover:underline">Best by category</Link>
        </p>
      </main>
    </div>
  );
}
