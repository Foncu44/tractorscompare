import { Zap, Fuel, Cog, Settings, Weight, DollarSign, TrendingDown } from 'lucide-react';

export interface QuickFactsGridProps {
  powerHP?: number | null;
  powerKW?: number | null;
  fuelType?: string | null;
  transmissionType?: string | null;
  ptoHP?: number | null;
  ptoRPM?: number | null;
  weightKg?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
  usedMin?: number | null;
  usedMax?: number | null;
}

const fact = (
  icon: React.ReactNode,
  label: string,
  value: React.ReactNode,
  className?: string
) => (
  <div
    className={`flex items-center gap-2 md:gap-3 bg-white rounded-lg p-3 md:p-4 border border-gray-200 min-w-0 ${className ?? ''}`}
  >
    <span className="text-primary-700 flex-shrink-0">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-xs md:text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900 text-sm md:text-base break-words">{value}</p>
    </div>
  </div>
);

export default function QuickFactsGrid({
  powerHP,
  powerKW,
  fuelType,
  transmissionType,
  ptoHP,
  ptoRPM,
  weightKg,
  priceMin,
  priceMax,
  usedMin,
  usedMax,
}: QuickFactsGridProps) {
  const hasNewPrice = (priceMin != null && priceMin > 0) || (priceMax != null && priceMax > 0);
  const hasUsedPrice = usedMin != null && usedMax != null && usedMin > 0;

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
      {powerHP != null && powerHP > 0 && fact(
        <Zap className="h-4 w-4 md:h-5 md:w-5" />,
        'Power',
        powerKW != null ? `${powerHP} HP (${powerKW} kW)` : `${powerHP} HP`
      )}
      {fuelType && fact(
        <Fuel className="h-4 w-4 md:h-5 md:w-5" />,
        'Fuel',
        fuelType.charAt(0).toUpperCase() + fuelType.slice(1)
      )}
      {transmissionType && fact(
        <Cog className="h-4 w-4 md:h-5 md:w-5" />,
        'Transmission',
        transmissionType.charAt(0).toUpperCase() + transmissionType.slice(1).replace(/([A-Z])/g, ' $1')
      )}
      {(ptoHP != null && ptoHP > 0) || ptoRPM ? fact(
        <Settings className="h-4 w-4 md:h-5 md:w-5" />,
        'PTO',
        ptoHP != null && ptoHP > 0
          ? ptoRPM ? `${ptoHP} HP @ ${ptoRPM} rpm` : `${ptoHP} HP`
          : ptoRPM ? `${ptoRPM} rpm` : '—'
      ) : null}
      {weightKg != null && weightKg > 0 && fact(
        <Weight className="h-4 w-4 md:h-5 md:w-5" />,
        'Weight',
        `${weightKg.toLocaleString()} kg (${Math.round(weightKg / 1000)} t)`
      )}
      {hasNewPrice && fact(
        <DollarSign className="h-4 w-4 md:h-5 md:w-5" />,
        'New price (est.)',
        priceMin != null && priceMax != null
          ? `$${priceMin.toLocaleString()} – $${priceMax.toLocaleString()}`
          : priceMin != null
            ? `From $${priceMin.toLocaleString()}`
            : `Up to $${priceMax!.toLocaleString()}`
      )}
      {hasUsedPrice && fact(
        <TrendingDown className="h-4 w-4 md:h-5 md:w-5" />,
        'Est. used price',
        `$${usedMin!.toLocaleString()} – $${usedMax!.toLocaleString()}`
      )}
    </div>
  );
}
