/**
 * Tractor Performance Profile Generator
 * Builds pros, cons, ideal use case, maintenance/operating cost tiers, and 200-300 word summary.
 */

import type { TractorSpecsInput, TractorSuitabilityResult } from '@/lib/tractorSuitability';
import type { PerformanceProfile } from '../types';
import { generateIdealUseCase } from './idealUseCase';
import { getMaintenanceTier } from './maintenanceTier';
import { getOperatingCostTier } from './operatingCostTier';
import { generateExtendedExpertSummary } from './expertSummary';

export function buildPerformanceProfile(
  tractorId: string,
  tractorName: string,
  specs: TractorSpecsInput,
  suitabilityResult: TractorSuitabilityResult
): PerformanceProfile {
  const maintenance = getMaintenanceTier(suitabilityResult);
  const operatingCost = getOperatingCostTier(suitabilityResult);
  const idealUseCase = generateIdealUseCase(specs, suitabilityResult);
  const expertSummary = generateExtendedExpertSummary(
    specs,
    suitabilityResult,
    maintenance,
    operatingCost,
    idealUseCase,
    tractorName
  );

  return {
    tractorId,
    tractorName,
    pros: suitabilityResult.pros,
    cons: suitabilityResult.cons,
    idealUseCase,
    maintenanceTier: maintenance.tier,
    maintenanceTierDescription: maintenance.description,
    operatingCostTier: operatingCost.tier,
    operatingCostTierDescription: operatingCost.description,
    expertSummary,
  };
}

export { generateIdealUseCase } from './idealUseCase';
export { getMaintenanceTier } from './maintenanceTier';
export { getOperatingCostTier } from './operatingCostTier';
export { generateExtendedExpertSummary } from './expertSummary';
