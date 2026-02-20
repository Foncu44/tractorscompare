/**
 * Ideal Use Case - Deterministic 1-3 sentence description from scores and specs
 */

import type { TractorSpecsInput, TractorSuitabilityResult } from '@/lib/tractorSuitability';

export function generateIdealUseCase(
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult
): string {
  const parts: string[] = [];
  const hp = specs.engine.powerHP;
  const weight = specs.weight;

  if (result.smallFarmScore >= 70 && result.loaderScore >= 60) {
    parts.push(
      'Ideal for small to mid-size farms (roughly 5–40 ha), loader and material handling, mowing and hay work'
    );
  } else if (result.smallFarmScore >= 70) {
    parts.push(
      'Ideal for small to mid-size farms (roughly 5–40 ha), light fieldwork, mowing, and properties where maneuverability matters'
    );
  } else if (result.largeFarmScore >= 70) {
    parts.push(
      'Ideal for large acreage, heavy tillage, row-crop work, and high-capacity PTO and hydraulic implements'
    );
  }

  if (result.versatilityIndex >= 70) {
    parts.push('mixed use with multiple PTO and hydraulic implements');
  }
  if (result.fuelEfficiency >= 70) {
    parts.push('operations where fuel economy is a priority');
  }
  if (weight != null && weight < 2500 && hp < 70) {
    parts.push('tight spaces and transport on smaller trailers');
  }
  if (hp >= 120 && (result.largeFarmScore >= 60 || result.loaderScore >= 60)) {
    parts.push('demanding loader and draft work on larger operations');
  }

  if (parts.length === 0) {
    return `General-purpose tractor suited to ${hp} HP class; match to your acreage and primary tasks using TractorSuitability™ scores.`;
  }

  const unique = [...new Set(parts)];
  return unique.join(', ') + '.';
}
