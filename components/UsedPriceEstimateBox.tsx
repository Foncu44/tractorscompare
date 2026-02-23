import { estimateUsedPrice, type UsedPriceEstimate } from '@/lib/usedPriceEstimate';

export interface UsedPriceEstimateBoxProps {
  category?: string;
  powerHP?: number | null;
  priceRange?: { min?: number; max?: number } | null;
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

export default function UsedPriceEstimateBox({
  category,
  powerHP,
  priceRange,
}: UsedPriceEstimateBoxProps) {
  const estimate = estimateUsedPrice({
    category: category === 'lawn' ? 'Lawn' : category === 'industrial' ? 'Industrial' : 'Farm',
    powerHP: powerHP ?? null,
    priceMin: priceRange?.min ?? null,
    priceMax: priceRange?.max ?? null,
  });

  if (!estimate) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 md:p-6 border-2 border-amber-200">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Estimated Used Price</h3>
      <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
        ${estimate.usedMin.toLocaleString()} – ${estimate.usedMax.toLocaleString()} ({estimate.currency})
      </p>
      <p className="text-xs text-amber-800/80 mb-2">{confidenceLabel(estimate.confidence)}</p>
      <p className="text-xs text-gray-600">
        Estimate only. Actual prices vary by condition, hours, and region.
      </p>
    </div>
  );
}
