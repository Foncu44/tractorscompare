/**
 * Filter tractors by budget and minimum specs for Decision Simulator
 */

export interface TractorForRecommendation {
  id: string;
  slug: string;
  brand: string;
  model: string;
  engine: { powerHP: number };
  transmission?: { type: string };
  weight?: number;
  hydraulicSystem?: { pumpFlow?: number; liftCapacity?: number };
  ptoHP?: number;
  priceRange?: { min?: number; max?: number };
}

export function filterByBudget(
  tractors: TractorForRecommendation[],
  budgetMaxUSD: number
): TractorForRecommendation[] {
  return tractors.filter((t) => {
    const minPrice = t.priceRange?.min ?? t.priceRange?.max;
    if (minPrice == null) return true;
    return minPrice <= budgetMaxUSD * 1.05;
  });
}

export function filterByMinSpecs(
  tractors: TractorForRecommendation[],
  minHP: number = 0
): TractorForRecommendation[] {
  return tractors.filter(
    (t) =>
      t.engine?.powerHP != null &&
      t.transmission?.type != null &&
      t.engine.powerHP >= minHP
  );
}
