import type { TractorInsights } from '@/lib/tractorPageContent';

export interface RealWorldInsightsProps {
  insights: TractorInsights;
}

export default function RealWorldInsights({ insights }: RealWorldInsightsProps) {
  const { highlights, tradeoffs, bestFor, notIdealFor } = insights;

  return (
    <section
      className="mt-8 md:mt-12 bg-white rounded-xl border border-gray-200 p-4 md:p-6"
      aria-labelledby="real-world-insights-heading"
    >
      <h2 id="real-world-insights-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Real-world performance & ownership
      </h2>

      {highlights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Highlights</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm md:text-base">
            {highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {tradeoffs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Trade-offs</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {tradeoffs.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {bestFor.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Best for</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              {bestFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {notIdealFor.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Not ideal for</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
              {notIdealFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
