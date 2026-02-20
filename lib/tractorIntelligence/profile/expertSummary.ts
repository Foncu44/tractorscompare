/**
 * Extended expert summary (200-300 words) - Deterministic, from specs + suitability + profile tiers
 */

import type { TractorSpecsInput, TractorSuitabilityResult } from '@/lib/tractorSuitability';
import type { MaintenanceTierResult } from './maintenanceTier';
import type { OperatingCostTierResult } from './operatingCostTier';

export function generateExtendedExpertSummary(
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult,
  maintenance: MaintenanceTierResult,
  operatingCost: OperatingCostTierResult,
  idealUseCase: string,
  tractorName?: string
): string {
  const name = tractorName ?? 'This tractor';
  const hp = specs.engine.powerHP;
  const weight = specs.weight ?? 0;
  const trans = specs.transmission?.type;
  const transLabel: Record<string, string> = {
    manual: 'mechanical',
    powershift: 'powershift',
    hydrostatic: 'hydrostatic',
    cvt: 'CVT',
  };

  const segments: string[] = [];

  segments.push(
    `${name} receives an overall suitability score of ${result.overallScore}/100 from the TractorSuitability™ Engine. `
  );
  segments.push(
    `${idealUseCase} `
  );

  if (result.smallFarmScore >= 70 && result.smallFarmScore >= result.largeFarmScore) {
    segments.push(
      `With ${hp} HP and${weight ? ` around ${Math.round(weight / 1000)} tons` : ''} weight, it fits small and mid-size farms where maneuverability and running costs matter. `
    );
  } else if (result.largeFarmScore >= 70) {
    segments.push(
      `Its power (${hp} HP) and hydraulic capacity suit large acreage and intensive fieldwork. `
    );
  }

  segments.push(
    `Loader work rates ${result.loaderScore}/100; fuel efficiency index is ${result.fuelEfficiency}/100. `
  );
  segments.push(
    `Maintenance is classified as ${maintenance.tier}: ${maintenance.description} `
  );
  segments.push(
    `Operating cost tier is ${operatingCost.tier}: ${operatingCost.description} `
  );
  segments.push(
    `Versatility (${result.versatilityIndex}/100) reflects PTO and hydraulic options; cost tier (${result.costTier}/100) reflects value for money. `
  );

  const strong = [
    result.smallFarmScore >= 75 && 'small farm',
    result.largeFarmScore >= 75 && 'large farm',
    result.loaderScore >= 75 && 'loader work',
    result.versatilityIndex >= 75 && 'versatility',
    result.costTier >= 75 && 'value',
  ].filter(Boolean) as string[];
  const weak = [
    result.smallFarmScore < 50 && 'small farm',
    result.largeFarmScore < 50 && 'large farm',
    result.loaderScore < 50 && 'loader',
  ].filter(Boolean) as string[];

  if (strong.length) {
    segments.push(`It stands out in: ${strong.join(', ')}. `);
  }
  if (weak.length) {
    segments.push(`It has relative limitations in: ${weak.join(', ')}. `);
  }

  segments.push(
    `Overall, it offers a ${result.overallScore >= 75 ? 'well-balanced, competitive' : result.overallScore >= 55 ? 'balanced' : 'specialized'} profile for its class. `
  );
  segments.push(
    'The TractorSuitability™ Engine uses manufacturer technical data only to compute these indices in an objective, reproducible way. '
  );
  segments.push(
    'We recommend comparing these scores with your specific acreage, crop type, and implement needs before deciding.'
  );

  let full = segments.join('').trim();
  const wordCount = full.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200) {
    segments.splice(2, 0,
      'The suitability sub-scores allow an objective comparison of performance across farm sizes and use types. '
    );
    full = segments.join('').trim();
  }
  return full;
}
