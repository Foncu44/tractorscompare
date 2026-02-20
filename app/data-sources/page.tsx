import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Data Sources & Compilation | TractorsCompare',
  description:
    'How we compile and normalize tractor data: sources, field normalization, units, and updates. TractorFit™ uses this data for scoring.',
};

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container-custom py-8 md:py-12 max-w-3xl">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Data sources</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Data Sources & Compilation
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          TractorsCompare builds its tractor database from publicly available manufacturer and
          industry sources. This page describes how we collect, normalize, and use that data for
          specifications and TractorFit™ scoring.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Primary sources</h2>
          <p className="text-gray-700 mb-4">
            Specification data is compiled from official manufacturer literature (product sheets,
            technical manuals, and published specifications), industry databases that aggregate
            manufacturer data, and established tractor data providers. We do not publish
            proprietary or confidential information; all fields used for TractorFit™ (engine power,
            weight, transmission type, hydraulic flow and lift, PTO, etc.) are typically found in
            public spec sheets or equivalent sources.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Normalization</h2>
          <p className="text-gray-700 mb-4">
            Data is normalized to consistent units and formats before storage and scoring. Power
            is stored in HP (horsepower), weight in kg, hydraulic flow in L/min, and lift capacity
            in kg. Transmission types are mapped to a fixed set (manual, powershift, hydrostatic,
            CVT). Brand and model names are standardized (e.g. consistent spacing and compound
            names). When sources use different units (e.g. lb vs kg), we convert to the internal
            standard so that TractorFit™ rules apply uniformly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Missing or incomplete data</h2>
          <p className="text-gray-700 mb-4">
            Not every tractor has every field. When a spec is missing, our pipeline uses
            conservative defaults for scoring (e.g. estimated weight or flow) so that models with
            incomplete data do not receive inflated scores. Missing optional fields (e.g. front
            PTO) simply do not contribute bonus points. This keeps comparisons fair and
            reproducible.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Updates and build pipeline</h2>
          <p className="text-gray-700 mb-4">
            The site uses an offline build pipeline: a minimal dataset (tractors.min.json) and
            slug list (slugs.json) are produced from the main database; then TractorFit™ scores,
            pros, cons, expert summaries, and “why this score” bullets are computed for each
            tractor and written to per-tractor JSON files. Indexes (e.g. top loader, top
            small-farm, HP buckets) are generated from these results. Static pages are built from
            this output so that no large JSON is loaded in the browser and build time stays
            manageable.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">No warranty on accuracy</h2>
          <p className="text-gray-700 mb-4">
            We strive to reflect published specifications accurately, but we do not guarantee
            that every value is current or error-free. For critical decisions, always confirm
            specifications with the manufacturer or dealer. TractorFit™ scores are derived only
            from the data we have; they are not a substitute for professional advice.
          </p>
        </section>

        <p className="text-gray-600 text-sm">
          <Link href="/methodology" className="text-primary-600 hover:underline">TractorFit™ methodology</Link>
          {' · '}
          <Link href="/tractores" className="text-primary-600 hover:underline">Tractor database</Link>
        </p>
      </main>
    </div>
  );
}
