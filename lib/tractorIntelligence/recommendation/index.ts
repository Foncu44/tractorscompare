/**
 * Decision Simulator Engine
 * Returns top N tractors matching user inputs using weighted suitability scoring.
 */

import { specsFromTractor, computeSuitability, type TractorLikeInput } from '@/lib/tractorSuitability';
import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';
import type {
  DecisionSimulatorInput,
  RecommendationItem,
  DecisionSimulatorResponse,
} from '../types';
import { getFarmSizeBand, getWeightsForUseCase } from './weights';
import { filterByBudget, filterByMinSpecs, type TractorForRecommendation } from './filters';

function buildMatchReasons(
  suitability: TractorSuitabilityResult,
  weights: ReturnType<typeof getWeightsForUseCase>,
  input: DecisionSimulatorInput
): string[] {
  const reasons: string[] = [];
  const w = weights;

  if (suitability.smallFarmScore >= 75 && w.smallFarm >= 0.12) {
    reasons.push('Strong small-farm fit for your acreage');
  }
  if (suitability.largeFarmScore >= 70 && w.largeFarm >= 0.12) {
    reasons.push('Sufficient power and hydraulics for large-scale work');
  }
  if (suitability.loaderScore >= 70 && w.loader >= 0.12) {
    reasons.push('Good loader performance and hydraulic capacity');
  }
  if (suitability.fuelEfficiency >= 70) {
    reasons.push('Strong fuel efficiency for the class');
  }
  if (suitability.maintenanceComplexity <= 35) {
    reasons.push('Low maintenance complexity and repair costs');
  }
  if (suitability.versatilityIndex >= 72 && w.versatility >= 0.14) {
    reasons.push('High versatility for multiple implements');
  }
  if (suitability.costTier >= 65) {
    reasons.push('Good value tier for budget');
  }
  if (suitability.powerToWeightScore >= 65 && input.terrain !== 'flat') {
    reasons.push('Good power-to-weight for terrain');
  }
  if (input.budgetMaxUSD != null && input.budgetMaxUSD > 0) {
    reasons.push('Within budget');
  }

  return reasons.slice(0, 4);
}

export function recommendTopTractors(
  tractors: TractorForRecommendation[],
  input: DecisionSimulatorInput,
  topN: number = 3
): DecisionSimulatorResponse {
  let list = filterByMinSpecs(tractors);
  if (input.budgetMaxUSD != null && input.budgetMaxUSD > 0) {
    list = filterByBudget(list, input.budgetMaxUSD);
  }

  const farmBand = getFarmSizeBand(input.farmSizeAcres);
  const weights = getWeightsForUseCase(input.primaryUse, farmBand, input.terrain);

  const scored = list.map((t) => {
    const specs = specsFromTractor(t as TractorLikeInput);
    const suitability = computeSuitability(specs, `${t.brand} ${t.model}`);
    const simplicity = 100 - suitability.maintenanceComplexity;
    const matchScore =
      suitability.smallFarmScore * weights.smallFarm +
      suitability.largeFarmScore * weights.largeFarm +
      suitability.loaderScore * weights.loader +
      suitability.fuelEfficiency * weights.fuelEfficiency +
      simplicity * weights.maintenanceSimplicity +
      suitability.versatilityIndex * weights.versatility +
      suitability.costTier * weights.costTier +
      suitability.powerToWeightScore * weights.powerToWeight;
    return {
      tractor: t,
      suitability,
      matchScore: Math.round(Math.min(100, Math.max(0, matchScore))),
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  const top = scored.slice(0, topN);

  const recommendations: RecommendationItem[] = top.map((item, i) => ({
    rank: i + 1,
    tractorId: item.tractor.id,
    slug: item.tractor.slug,
    brand: item.tractor.brand,
    model: item.tractor.model,
    matchScore: item.matchScore,
    suitability: item.suitability,
    matchReasons: buildMatchReasons(item.suitability, weights, input),
  }));

  return {
    request: input,
    recommendations,
  };
}

export { getWeightsForUseCase, getFarmSizeBand } from './weights';
export { filterByBudget, filterByMinSpecs } from './filters';
