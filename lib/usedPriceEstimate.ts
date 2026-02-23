/**
 * Deterministic used price estimate from new price range or horsepower fallback.
 */

export type UsedPriceEstimate = {
  usedMin: number;
  usedMax: number;
  currency: 'USD';
  confidence: 'high' | 'medium' | 'low';
  method: 'from_new_price_range' | 'from_hp_fallback';
  notes: string[];
};

type Category = 'Farm' | 'Lawn' | 'Industrial';

const FARM_DEPRECIATION = { min: 0.35, max: 0.7 };
const LAWN_DEPRECIATION = { min: 0.3, max: 0.65 };
const INDUSTRIAL_DEPRECIATION = { min: 0.35, max: 0.7 }; // same as Farm

const FARM_HP_MULTIPLIER = 900;
const LAWN_HP_MULTIPLIER = 600;
const INDUSTRIAL_HP_MULTIPLIER = 900;

function roundDollars(n: number): number {
  return Math.round(n);
}

export function estimateUsedPrice(params: {
  category?: string;
  powerHP?: number | null;
  priceMin?: number | null;
  priceMax?: number | null;
}): UsedPriceEstimate | null {
  const { category, powerHP, priceMin, priceMax } = params;
  const cat = (category || 'Farm') as Category;
  const dep =
    cat === 'Lawn'
      ? LAWN_DEPRECIATION
      : cat === 'Industrial'
        ? INDUSTRIAL_DEPRECIATION
        : FARM_DEPRECIATION;

  const hasMin = typeof priceMin === 'number' && priceMin > 0;
  const hasMax = typeof priceMax === 'number' && priceMax > 0;
  const hasBoth = hasMin && hasMax;
  const hasOne = hasMin || hasMax;

  if (hasBoth) {
    const usedMin = roundDollars(priceMin! * dep.min);
    const usedMax = roundDollars(priceMax! * dep.max);
    return {
      usedMin,
      usedMax,
      currency: 'USD',
      confidence: 'high',
      method: 'from_new_price_range',
      notes: ['Estimated from new price range using depreciation bands.'],
    };
  }

  if (hasOne) {
    const single = hasMin ? priceMin! : priceMax!;
    const usedMin = roundDollars(single * dep.min * 0.9);
    const usedMax = roundDollars(single * dep.max * 1.1);
    return {
      usedMin,
      usedMax,
      currency: 'USD',
      confidence: 'medium',
      method: 'from_new_price_range',
      notes: ['Estimated from single price point with broader band.'],
    };
  }

  if (typeof powerHP === 'number' && powerHP > 0) {
    const mult =
      cat === 'Lawn'
        ? LAWN_HP_MULTIPLIER
        : cat === 'Industrial'
          ? INDUSTRIAL_HP_MULTIPLIER
          : FARM_HP_MULTIPLIER;
    const base = powerHP * mult;
    const usedMin = roundDollars(base * 0.6);
    const usedMax = roundDollars(base * 1.1);
    return {
      usedMin,
      usedMax,
      currency: 'USD',
      confidence: 'low',
      method: 'from_hp_fallback',
      notes: ['Estimated from horsepower due to missing new price range.'],
    };
  }

  return null;
}
