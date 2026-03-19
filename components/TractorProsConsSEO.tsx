/**
 * Standalone Pros and Cons section for tractor detail pages.
 * Server component — static HTML output for Google featured snippets.
 *
 * Uses the narrative highlights (pros) and tradeoffs (cons) already computed
 * by buildTractorNarrative(), so no extra computation is needed.
 *
 * The <ul> bullet structure is specifically chosen because Google extracts
 * bullet-point pros/cons for featured snippets and rich results.
 */

interface Props {
  pros: string[];
  cons: string[];
  tractorName: string;
  locale?: 'en' | 'es';
}

export default function TractorProsConsSEO({ pros, cons, tractorName, locale = 'en' }: Props) {
  if (!pros.length && !cons.length) return null;

  const labels =
    locale === 'es'
      ? { title: 'Ventajas y desventajas', pros: 'Ventajas', cons: 'Desventajas' }
      : { title: 'Pros and Cons', pros: 'Pros', cons: 'Cons' };

  return (
    <section
      className="mt-8 md:mt-12 bg-white rounded-xl border border-gray-200 p-4 md:p-6"
      aria-labelledby="pros-cons-heading"
    >
      <h2 id="pros-cons-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
        {tractorName} — {labels.title}
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Pros */}
        {pros.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold" aria-hidden>✓</span>
              {labels.pros}
            </h3>
            <ul className="space-y-2">
              {pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <span className="text-green-600 flex-shrink-0 mt-0.5" aria-hidden>✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons */}
        {cons.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold" aria-hidden>✗</span>
              {labels.cons}
            </h3>
            <ul className="space-y-2">
              {cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                  <span className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden>✗</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
