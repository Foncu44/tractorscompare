import type { TractorNarrative } from '@/lib/tractorNarrative';

export interface TractorNarrativeSectionProps {
  narrative: TractorNarrative;
}

export default function TractorNarrativeSection({ narrative }: TractorNarrativeSectionProps) {
  return (
    <section
      className="mt-8 md:mt-12 bg-white rounded-card border border-gray-200 shadow-card p-4 md:p-6"
      aria-labelledby="tractorfit-narrative-heading"
    >
      <h2 id="tractorfit-narrative-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        TractorFit Narrative
      </h2>

      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
        {narrative.summary}
      </p>

      {narrative.highlights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Highlights</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm md:text-base">
            {narrative.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {narrative.tradeoffs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Tradeoffs & limitations</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {narrative.tradeoffs.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {narrative.bestFor.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Best for</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              {narrative.bestFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {narrative.notIdealFor.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Not ideal for</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
              {narrative.notIdealFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {narrative.buyingTips.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Buying tips</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            {narrative.buyingTips.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
