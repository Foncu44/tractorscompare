/**
 * Maintenance Tier - Deterministic label and description from suitability score
 */

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';

export type MaintenanceTierLabel = 'Low' | 'Moderate' | 'High' | 'Specialized';

export interface MaintenanceTierResult {
  tier: MaintenanceTierLabel;
  description: string;
}

export function getMaintenanceTier(
  result: TractorSuitabilityResult
): MaintenanceTierResult {
  const c = result.maintenanceComplexity;
  if (c < 35) {
    return {
      tier: 'Low',
      description:
        'Mechanical transmission and straightforward engine design; lower repair costs and easier DIY or general dealer servicing.',
    };
  }
  if (c < 55) {
    return {
      tier: 'Moderate',
      description:
        'Powershift or similar transmission; standard dealer servicing recommended with moderate complexity and cost.',
    };
  }
  if (c < 75) {
    return {
      tier: 'High',
      description:
        'Hydrostatic or advanced transmission; higher repair costs and specialized service recommended.',
    };
  }
  return {
    tier: 'Specialized',
    description:
      'CVT or complex drivetrain; specialized technical service and higher maintenance costs expected.',
  };
}
