/**
 * Guide SEO - Analytical snippets (top tractors by metric, spec ranges) for guide pages
 */

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';

export interface TractorWithSuitability {
  id: string;
  slug: string;
  brand: string;
  model: string;
  engine: { powerHP: number };
  suitability: TractorSuitabilityResult;
  hydraulicSystem?: { pumpFlow?: number; liftCapacity?: number };
}

export function getTopTractorsByScore(
  tractors: TractorWithSuitability[],
  scoreKey: keyof TractorSuitabilityResult,
  limit: number = 5
): TractorWithSuitability[] {
  const key = scoreKey as keyof TractorSuitabilityResult;
  const num = (r: TractorSuitabilityResult) => {
    const v = r[key];
    return typeof v === 'number' ? v : 0;
  };
  return [...tractors]
    .filter((t) => t.suitability[key] != null)
    .sort((a, b) => num(b.suitability) - num(a.suitability))
    .slice(0, limit);
}

export function getLoaderScoreSpecRanges(): string {
  return 'Loader score 70–80 typically corresponds to hydraulic pump flow of about 80–120 L/min and rear lift capacity of 2,500–4,000 kg. Scores above 80 often include front loaders with 2,000+ kg front lift and higher flow.';
}

export function getSmallFarmSpecRanges(): string {
  return 'Small-farm suitability peaks for tractors in the 35–65 HP range with operating weight under about 2.5 tons. Higher scores also reflect mechanical or powershift transmissions and good versatility.';
}

export function getFuelEfficiencySpecRanges(): string {
  return 'Fuel efficiency index is driven by diesel (or electric) fuel type, power-to-weight ratio, and displacement per HP. Higher scores typically indicate modern diesel engines with good HP per liter.';
}

export function getGuideAnalyticalSnippet(
  topic: string,
  tractors: TractorWithSuitability[]
): { topTractors: TractorWithSuitability[]; specRanges: string } | null {
  const t = topic.toLowerCase();
  if (t.includes('loader') || t.includes('hydraulic')) {
    return {
      topTractors: getTopTractorsByScore(tractors, 'loaderScore', 5),
      specRanges: getLoaderScoreSpecRanges(),
    };
  }
  if (t.includes('small') || t.includes('size') || t.includes('acre')) {
    return {
      topTractors: getTopTractorsByScore(tractors, 'smallFarmScore', 5),
      specRanges: getSmallFarmSpecRanges(),
    };
  }
  if (t.includes('fuel') || t.includes('efficiency')) {
    return {
      topTractors: getTopTractorsByScore(tractors, 'fuelEfficiency', 5),
      specRanges: getFuelEfficiencySpecRanges(),
    };
  }
  return null;
}
