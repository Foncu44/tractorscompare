/**
 * TractorSuitability™ Engine
 * Transforms raw tractor specs into a deterministic suitability analysis.
 */

import type { TractorSpecsInput, TractorSuitabilityResult } from './types';
import * as scorers from './scorers';
import { generatePros, generateCons, generateExpertSummary } from './insights';

export type { TractorSpecsInput, TractorSuitabilityResult } from './types';

/** Input shape accepted by specsFromTractor (compatible with Tractor and plain objects). */
export type TractorLikeInput = {
  engine: { powerHP: number; fuelType?: string; displacement?: number; cylinders?: number };
  transmission: { type: string; gears?: number };
  weight?: number;
  hydraulicSystem?: {
    pumpFlow?: number;
    liftCapacity?: number;
    frontLiftCapacity?: number;
    rearValves?: number;
    valves?: number;
  };
  ptoHP?: number;
  ptoRPM?: number;
  ptoRearSpeeds?: string;
  ptoFront?: string;
  ptoFrontPower?: number;
  dimensions?: { length?: number; width?: number; wheelbase?: number; groundClearance?: number };
  capacities?: { fuelTank?: number };
  priceRange?: { min?: number; max?: number };
};

/**
 * Builds the minimal specs input from a full tractor-like object (e.g. Tractor).
 * Safe for partial data; missing fields are defaulted.
 */
export function specsFromTractor(tractor: TractorLikeInput): TractorSpecsInput {
  const transmissionType = ['manual', 'hydrostatic', 'powershift', 'cvt'].includes(tractor.transmission?.type)
    ? tractor.transmission.type as TractorSpecsInput['transmission']['type']
    : 'manual';

  return {
    engine: {
      powerHP: tractor.engine.powerHP,
      fuelType: tractor.engine.fuelType as TractorSpecsInput['engine']['fuelType'],
      displacement: tractor.engine.displacement,
      cylinders: tractor.engine.cylinders,
    },
    transmission: {
      type: transmissionType,
      gears: tractor.transmission.gears,
    },
    weight: tractor.weight,
    hydraulicSystem: tractor.hydraulicSystem
      ? {
          pumpFlow: tractor.hydraulicSystem.pumpFlow,
          liftCapacity: tractor.hydraulicSystem.liftCapacity,
          frontLiftCapacity: tractor.hydraulicSystem.frontLiftCapacity,
          rearValves: tractor.hydraulicSystem.rearValves,
          valves: tractor.hydraulicSystem.valves,
        }
      : undefined,
    ptoHP: tractor.ptoHP,
    ptoRPM: tractor.ptoRPM,
    ptoRearSpeeds: tractor.ptoRearSpeeds,
    ptoFront: tractor.ptoFront,
    ptoFrontPower: tractor.ptoFrontPower,
    dimensions: tractor.dimensions,
    capacities: tractor.capacities,
    priceRange: tractor.priceRange,
  };
}

/**
 * Runs the full TractorSuitability™ analysis.
 * Pure and deterministic: same specs → same result.
 */
export function computeSuitability(specs: TractorSpecsInput, tractorName?: string): TractorSuitabilityResult {
  const smallFarmScore = scorers.scoreSmallFarm(specs);
  const largeFarmScore = scorers.scoreLargeFarm(specs);
  const loaderScore = scorers.scoreLoader(specs);
  const fuelEfficiency = scorers.scoreFuelEfficiency(specs);
  const maintenanceComplexity = scorers.scoreMaintenanceComplexity(specs);
  const versatilityIndex = scorers.scoreVersatility(specs);
  const costTier = scorers.scoreCostTier(specs);
  const powerToWeightScore = scorers.scorePowerToWeight(specs);
  const overallScore = scorers.scoreOverall(
    smallFarmScore,
    largeFarmScore,
    loaderScore,
    fuelEfficiency,
    maintenanceComplexity,
    versatilityIndex,
    costTier,
    powerToWeightScore
  );

  const result: TractorSuitabilityResult = {
    overallScore,
    smallFarmScore,
    largeFarmScore,
    loaderScore,
    fuelEfficiency,
    maintenanceComplexity,
    versatilityIndex,
    costTier,
    powerToWeightScore,
    pros: [],
    cons: [],
    expertSummary: '',
  };

  result.pros = generatePros(specs, result);
  result.cons = generateCons(specs, result);
  result.expertSummary = generateExpertSummary(specs, result, tractorName);

  return result;
}

/**
 * One-shot: from a full tractor object to the analysis result.
 */
export function analyzeTractor(
  tractor: TractorLikeInput,
  tractorName?: string
): TractorSuitabilityResult {
  const specs = specsFromTractor(tractor);
  return computeSuitability(specs, tractorName);
}
