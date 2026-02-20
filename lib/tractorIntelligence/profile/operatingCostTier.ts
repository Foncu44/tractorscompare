/**
 * Operating Cost Tier - Deterministic from fuel efficiency, cost tier, maintenance
 */

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';

export type OperatingCostTierLabel = 'Low' | 'Moderate' | 'Elevated' | 'Premium';

export interface OperatingCostTierResult {
  tier: OperatingCostTierLabel;
  description: string;
}

export function getOperatingCostTier(
  result: TractorSuitabilityResult
): OperatingCostTierResult {
  const fuel = result.fuelEfficiency;
  const cost = result.costTier;
  const maint = result.maintenanceComplexity;

  const simplicity = 100 - maint;
  const combined = fuel * 0.4 + cost * 0.35 + simplicity * 0.25;

  if (combined >= 75) {
    return {
      tier: 'Low',
      description:
        'Good fuel efficiency, strong value tier, and low maintenance complexity keep operating costs down.',
    };
  }
  if (combined >= 55) {
    return {
      tier: 'Moderate',
      description:
        'Reasonable fuel efficiency and maintenance; operating costs are in line with the power class.',
    };
  }
  if (combined >= 35) {
    return {
      tier: 'Elevated',
      description:
        'Higher fuel or maintenance costs relative to segment; budget accordingly for fuel and servicing.',
    };
  }
  return {
    tier: 'Premium',
    description:
      'Premium segment with higher fuel and maintenance expectations; plan for elevated operating costs.',
  };
}
