import type { UsedPriceEstimate } from '@/lib/usedPriceEstimate';
import { CheckCircle2, Info } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';

export interface UsedMarketInsightsProps {
  locale?: Locale;
  /** Estimated used price (from estimateUsedPrice); if null, section can still show checklist + note */
  usedEstimate?: UsedPriceEstimate | null;
  /** 3–6 buyer checklist items (e.g. from narrative.buyingTips) */
  buyerChecklist: string[];
  /** Category for note (Farm/Lawn) */
  category?: 'farm' | 'lawn' | 'industrial';
  /** Tractor name for copy */
  tractorName?: string;
}

function confidenceLabelKey(confidence: UsedPriceEstimate['confidence']): string {
  switch (confidence) {
    case 'high':
      return 'usedMarket.highConfidence';
    case 'medium':
      return 'usedMarket.mediumConfidence';
    case 'low':
      return 'usedMarket.lowConfidence';
    default:
      return '';
  }
}

export default function UsedMarketInsights({
  locale = 'en',
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
        {t('usedMarket.title', undefined, locale)}
      </h2>

      {usedEstimate && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 md:p-6 border-2 border-amber-200 mb-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{t('usedMarket.estimatedUsedPrice', undefined, locale)}</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            ${usedEstimate.usedMin.toLocaleString()} – ${usedEstimate.usedMax.toLocaleString()} {usedEstimate.currency}
          </p>
          <p className="text-xs text-amber-800/80 mb-2">{t(confidenceLabelKey(usedEstimate.confidence), undefined, locale)}</p>
          <p className="text-xs text-gray-600">
            {t('usedMarket.estimateNote', undefined, locale)}
          </p>
        </div>
      )}

      {buyerChecklist.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-2">{t('usedMarket.buyerChecklist', undefined, locale)}</h3>
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
            <p>{t('usedMarket.forUsedLawn', { name }, locale)}</p>
          ) : category === 'industrial' ? (
            <p>{t('usedMarket.forUsedIndustrial', { name }, locale)}</p>
          ) : (
            <p>{t('usedMarket.forUsedFarm', { name }, locale)}</p>
          )}
        </div>
      </div>
    </section>
  );
}
