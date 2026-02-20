/**
 * TractorSuitability™ Engine - Pros, cons and expert summary (English)
 * All text is derived deterministically from scores and specs.
 */

import type { TractorSpecsInput, TractorSuitabilityResult } from './types';

export function generatePros(specs: TractorSpecsInput, result: TractorSuitabilityResult): string[] {
  const pros: string[] = [];
  const hp = specs.engine.powerHP;
  const weight = specs.weight;
  const flow = specs.hydraulicSystem?.pumpFlow;
  const lift = specs.hydraulicSystem?.liftCapacity;
  const ptoHP = specs.ptoHP;
  const trans = specs.transmission?.type;

  if (result.smallFarmScore >= 75) pros.push('Well suited to small and mid-size farms for power and maneuverability.');
  if (result.largeFarmScore >= 70) pros.push('Sufficient power and hydraulic capacity for large-scale fieldwork.');
  if (result.loaderScore >= 70) pros.push('Good loader performance thanks to hydraulics and weight.');
  if (result.fuelEfficiency >= 70) pros.push('Efficient consumption relative to power-to-weight and engine type.');
  if (result.maintenanceComplexity <= 35) pros.push('Simple maintenance; mechanical transmission with lower repair costs.');
  if (result.versatilityIndex >= 70) pros.push('High versatility: PTO and hydraulic options for multiple implements.');
  if (result.powerToWeightScore >= 70) pros.push('Strong power-to-weight ratio for drawbar work and acceleration.');
  if (result.costTier >= 70) pros.push('Strong value for money relative to power and features.');

  if (hp < 60 && pros.length < 4) pros.push('Adequate power for light duties and use in tight spaces.');
  if (hp >= 120 && pros.length < 4) pros.push('High power for heavy fieldwork and demanding equipment.');
  if ((flow ?? 0) >= 80 && (lift ?? 0) >= 2000) pros.push('Powerful hydraulic system with good lift capacity.');
  if (trans === 'manual') pros.push('Reliable manual transmission with low maintenance cost.');
  if (trans === 'cvt') pros.push('CVT transmission for smooth operation and continuous adaptation to load.');
  if (ptoHP != null && specs.engine.powerHP > 0 && ptoHP / specs.engine.powerHP >= 0.88) pros.push('Strong PTO relative to engine, ideal for PTO-driven implements.');

  return [...new Set(pros)].slice(0, 8);
}

export function generateCons(specs: TractorSpecsInput, result: TractorSuitabilityResult): string[] {
  const cons: string[] = [];
  const hp = specs.engine.powerHP;
  const weight = specs.weight;
  const flow = specs.hydraulicSystem?.pumpFlow ?? 0;
  const lift = specs.hydraulicSystem?.liftCapacity ?? 0;
  const trans = specs.transmission?.type;

  if (result.smallFarmScore < 50 && hp > 100) cons.push('May be excessive in size and fuel use for very small farms.');
  if (result.largeFarmScore < 50 && hp < 80) cons.push('Limited power for large-scale work or heavy equipment.');
  if (result.loaderScore < 50) cons.push('Limited capacity for intensive loader work.');
  if (result.fuelEfficiency < 55) cons.push('Relatively high fuel consumption for the power available.');
  if (result.maintenanceComplexity >= 70) cons.push('Higher maintenance complexity; specialized service recommended.');
  if (result.versatilityIndex < 50) cons.push('Limited PTO or hydraulic options for some implements.');
  if (result.powerToWeightScore < 45) cons.push('Modest power-to-weight ratio; less agility in traction and on slopes.');
  if (result.costTier < 50) cons.push('Premium price segment relative to power and specification level.');

  if ((flow < 40 || lift < 1500) && cons.length < 4) cons.push('Basic hydraulic system; limited for demanding implements.');
  if (trans === 'cvt' && cons.length < 5) cons.push('CVT transmission with higher repair cost than mechanical.');
  if (weight != null && weight > 5000 && hp < 100) cons.push('Heavy for the power output; may reduce efficiency in drawbar work.');

  return [...new Set(cons)].slice(0, 6);
}

/**
 * Builds a 150–300 word expert-style summary from scores and specs. Deterministic. English.
 */
export function generateExpertSummary(
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult,
  tractorName?: string
): string {
  const hp = specs.engine.powerHP;
  const weight = specs.weight ?? 0;
  const name = tractorName ?? 'This tractor';
  const trans = specs.transmission?.type;
  const transLabel = { manual: 'mechanical', powershift: 'powershift', hydrostatic: 'hydrostatic', cvt: 'CVT' }[trans ?? 'manual'];

  const segments: string[] = [];

  segments.push(
    `${name} receives an overall suitability score of ${result.overallScore}/100 from the TractorSuitability™ Engine. `
  );

  if (result.smallFarmScore >= 70 && result.smallFarmScore >= result.largeFarmScore) {
    segments.push(
      `With ${hp} HP and${weight ? ` around ${Math.round(weight / 1000)} tons` : ''} moderate weight, it is well suited to small and mid-size farms where maneuverability and running costs matter. `
    );
  } else if (result.largeFarmScore >= 70) {
    segments.push(
      `Its power (${hp} HP) and hydraulic capacity make it better suited to large acreage and intensive fieldwork. `
    );
  }

  segments.push(
    `For loader work the rating is ${result.loaderScore}/100, driven by hydraulic flow and lift capacity. `
  );
  segments.push(
    `The fuel efficiency index is ${result.fuelEfficiency}/100. `
  );

  if (result.maintenanceComplexity <= 35) {
    segments.push(
      `The ${transLabel} transmission implies low maintenance complexity, with lower repair costs and easier servicing. `
    );
  } else if (result.maintenanceComplexity >= 65) {
    segments.push(
      `The ${transLabel} transmission increases maintenance complexity; specialized technical service is recommended. `
    );
  }

  segments.push(
    `Versatility (${result.versatilityIndex}/100) reflects the ability to run different implements via PTO and hydraulics. `
  );
  segments.push(
    `The power-to-weight ratio (${result.powerToWeightScore}/100) indicates its behavior in traction and acceleration. `
  );
  segments.push(
    `The cost tier score (${result.costTier}/100) reflects value for money based on price, power, and transmission type. `
  );

  const strongScores = [
    result.smallFarmScore >= 75 && 'small farm',
    result.largeFarmScore >= 75 && 'large farm',
    result.loaderScore >= 75 && 'loader work',
    result.versatilityIndex >= 75 && 'versatility',
  ].filter(Boolean) as string[];
  const weakScores = [
    result.smallFarmScore < 50 && 'small farm',
    result.largeFarmScore < 50 && 'large farm',
    result.loaderScore < 50 && 'loader',
  ].filter(Boolean) as string[];

  if (strongScores.length) {
    segments.push(
      `It stands out in: ${strongScores.join(', ')}. `
    );
  }
  if (weakScores.length) {
    segments.push(
      `It has relative limitations in: ${weakScores.join(', ')}. `
    );
  }

  segments.push(
    `Overall, it offers a ${result.overallScore >= 75 ? 'well-balanced, competitive' : result.overallScore >= 55 ? 'balanced' : 'specialized'} technical profile, depending on your farm size and priorities. `
  );

  segments.push(
    'The TractorSuitability™ Engine uses manufacturer technical data only to compute these indices in an objective, reproducible way. '
  );
  segments.push(
    'We recommend comparing these scores with your specific acreage, crop type, and implement needs before deciding.'
  );

  const full = segments.join('').trim();
  const wordCount = full.split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    segments.splice(1, 0,
      'The suitability sub-scores allow an objective comparison of performance across farm sizes and use types. '
    );
  }
  return segments.join('').trim();
}
