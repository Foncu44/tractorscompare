import type { UsedPriceEstimate } from '@/lib/usedPriceEstimate';
import { CheckCircle2, Info } from 'lucide-react';

export interface UsedMarketInsightsProps {
  /** Estimated used price (from estimateUsedPrice); if null, section can still show checklist + note */
  usedEstimate?: UsedPriceEstimate | null;
  /** 3–6 buyer checklist items (e.g. from narrative.buyingTips) */
  buyerChecklist: string[];
  /** Category for note (Farm/Lawn) */
  category?: 'farm' | 'lawn' | 'industrial';
  /** Tractor name for copy */
  tractorName?: string;
}

function confidenceLabel(confidence: UsedPriceEstimate['confidence']): string {
  switch (confidence) {
    case 'high':
      return 'High confidence';
    case 'medium':
      return 'Medium confidence';
    case 'low':
      return 'Low confidence';
    default:
      return '';
  }
}

export default function UsedMarketInsights({
  usedEstimate,
  buyerChecklist,
  category = 'farm',
  tractorName,
}: UsedMarketInsightsProps) {
  const name = tractorName ?? 'This tractor';

  return (
    <section
      className="mt-8 md:mt-12 bg-white rounded-xl border border-gray-200 p-4 md:p-6"
      aria-labelledby="used-market-heading"
    >
      <h2 id="used-market-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Used market insights
      </h2>

      {usedEstimate && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 md:p-6 border-2 border-amber-200 mb-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Estimated used price</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            ${usedEstimate.usedMin.toLocaleString()} – ${usedEstimate.usedMax.toLocaleString()} {usedEstimate.currency}
          </p>
          <p className="text-xs text-amber-800/80 mb-2">{confidenceLabel(usedEstimate.confidence)}</p>
          <p className="text-xs text-gray-600">
            Estimate only. Actual prices vary by condition, hours, and region.
          </p>
        </div>
      )}

      {buyerChecklist.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Buyer checklist</h3>
          <ul className="space-y-2">
            {buyerChecklist.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2 rounded-lg bg-gray-50 border border-gray-200 p-3 md:p-4">
        <Info className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden />
        <div className="text-sm text-gray-700">
          {category === 'lawn' ? (
            <p>
              For used {name}, check hours and blade deck condition. Verify PTO and transmission operation, and that attachments match.
            </p>
          ) : category === 'industrial' ? (
            <p>
              For used {name}, verify hours, hydraulic condition, and loader/backhoe compatibility. Confirm weight for transport and permits.
            </p>
          ) : (
            <p>
              For used {name}, hours and service history matter. Confirm PTO and hydraulic operation, tire condition, and that implements match your HP and category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
