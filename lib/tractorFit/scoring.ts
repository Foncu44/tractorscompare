/**
 * TractorFit™ - whyThisScore, FAQ, and 200-300 word expert summary (deterministic)
 */

import type { TractorSpecsInput, TractorSuitabilityResult } from '@/lib/tractorSuitability';
import { generatePros, generateCons, generateExpertSummary } from '@/lib/tractorSuitability/insights';
import type { TractorFitJson } from './types';

/** Generate exactly 5 "why this score" bullets from specs and scores. Deterministic. */
export function generateWhyThisScore(
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult
): string[] {
  const hp = specs.engine.powerHP;
  const weight = specs.weight ?? 0;
  const flow = specs.hydraulicSystem?.pumpFlow ?? 0;
  const lift = specs.hydraulicSystem?.liftCapacity ?? 0;
  const trans = specs.transmission?.type ?? 'manual';
  const weightT = weight / 1000;
  const hpPerTon = weightT > 0 ? hp / weightT : 0;

  const bullets: string[] = [];

  if (result.smallFarmScore >= 70) {
    bullets.push(
      `Small-farm score (${result.smallFarmScore}/100): ${hp} HP and ${weightT.toFixed(1)} t weight sit in the sweet spot for small and mid-size operations; power and maneuverability are well balanced.`
    );
  } else if (result.smallFarmScore < 50 && hp > 80) {
    bullets.push(
      `Small-farm score (${result.smallFarmScore}/100): At ${hp} HP and ${weightT.toFixed(1)} t, this tractor is sized for larger acreage rather than small farms; higher fuel and operating costs typically apply.`
    );
  } else {
    bullets.push(
      `Small-farm score (${result.smallFarmScore}/100): Based on ${hp} HP and operating weight; best for properties that match this power and size class.`
    );
  }

  if (result.loaderScore >= 60) {
    bullets.push(
      `Loader score (${result.loaderScore}/100): Hydraulic flow ${flow} L/min and rear lift ${lift} kg drive loader capability; ${flow >= 80 && lift >= 2000 ? 'strong' : 'adequate'} for typical loader work.`
    );
  } else {
    bullets.push(
      `Loader score (${result.loaderScore}/100): Limited by hydraulic flow (${flow} L/min) and lift capacity (${lift} kg); suitable for light loader use.`
    );
  }

  const transLabel = { manual: 'mechanical', powershift: 'powershift', hydrostatic: 'hydrostatic', cvt: 'CVT' }[trans];
  bullets.push(
    `Maintenance complexity (${result.maintenanceComplexity}/100): ${transLabel} transmission; ${result.maintenanceComplexity <= 35 ? 'lower repair costs and simpler servicing' : result.maintenanceComplexity >= 65 ? 'specialized service recommended' : 'moderate servicing requirements'}.`
  );

  bullets.push(
    `Fuel efficiency (${result.fuelEfficiency}/100): Engine type and power-to-weight (${hpPerTon.toFixed(0)} HP/t) determine the index; ${result.fuelEfficiency >= 70 ? 'efficient for the class' : result.fuelEfficiency < 55 ? 'higher consumption relative to power' : 'typical for the segment'}.`
  );

  bullets.push(
    `Overall (${result.overallScore}/100): Weighted combination of small-farm, large-farm, loader, fuel efficiency, maintenance ease, versatility, cost tier, and power-to-weight; no subjective inputs.`
  );

  return bullets.slice(0, 5);
}

/** Template-based FAQ from available specs. Deterministic. */
export function generateFaq(
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult,
  tractorName: string
): { q: string; a: string }[] {
  const hp = specs.engine.powerHP;
  const weight = specs.weight;
  const flow = specs.hydraulicSystem?.pumpFlow;
  const lift = specs.hydraulicSystem?.liftCapacity;
  const trans = specs.transmission?.type ?? 'manual';
  const faq: { q: string; a: string }[] = [];

  faq.push({
    q: `What is the TractorFit™ overall score for the ${tractorName}?`,
    a: `The ${tractorName} has a TractorFit™ overall score of ${result.overallScore}/100, calculated from manufacturer specifications including power, weight, hydraulics, transmission type, and PTO. Higher scores indicate a more balanced fit across farm size, loader work, fuel efficiency, and versatility.`,
  });

  faq.push({
    q: `Is the ${tractorName} suitable for small farms?`,
    a: `The small-farm suitability score is ${result.smallFarmScore}/100. ${result.smallFarmScore >= 70 ? 'This tractor is well suited to small and mid-size farms in terms of power and maneuverability.' : result.smallFarmScore >= 50 ? 'It can work on smaller operations depending on acreage and tasks.' : 'It is better matched to larger acreage or specialized use.'}`,
  });

  faq.push({
    q: `How does the ${tractorName} rate for loader work?`,
    a: `Loader work efficiency is ${result.loaderScore}/100, based on hydraulic pump flow${flow != null ? ` (${flow} L/min)` : ''} and lift capacity${lift != null ? ` (${lift} kg)` : ''}. ${result.loaderScore >= 70 ? 'Good for material handling and loader attachments.' : result.loaderScore >= 50 ? 'Adequate for light to moderate loader use.' : 'Best for light loader duties.'}`,
  });

  faq.push({
    q: `What transmission does the ${tractorName} have and how does it affect maintenance?`,
    a: `This model uses a ${trans} transmission. The maintenance complexity score is ${result.maintenanceComplexity}/100 (higher = more complex). ${result.maintenanceComplexity <= 35 ? 'Mechanical transmissions generally mean lower long-term repair costs.' : result.maintenanceComplexity >= 65 ? 'More complex transmissions may require specialized servicing.' : 'Servicing requirements are moderate.'}`,
  });

  faq.push({
    q: `How is the TractorFit™ score calculated?`,
    a: `TractorFit™ scores are computed only from published specifications: engine power, weight, hydraulic flow and lift, transmission type, PTO, and similar data. No subjective or random inputs are used. See our Methodology page for full details.`,
  });

  return faq.slice(0, 5);
}

/** Expert summary 200-300 words. Uses existing generator and pads if needed. */
export function generateExpertSummary200300(
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult,
  tractorName?: string
): string {
  let text = generateExpertSummary(specs, result, tractorName);
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 200) {
    text += ' TractorFit™ compares this model to others in the database using the same rules, so you can rank tractors by small-farm fit, loader capability, fuel efficiency, and versatility. We recommend matching these scores to your acreage, primary tasks, and implement list before deciding.';
  }
  const again = text.split(/\s+/).filter(Boolean).length;
  if (again < 200) {
    text += ' All scores are recalculated when specifications are updated to keep the analysis consistent and reproducible.';
  }
  return text.trim();
}

/** Build full TractorFitJson from TractorMin and suitability result. */
export function buildTractorFitJson(
  min: import('./types').TractorMin,
  specs: TractorSpecsInput,
  result: TractorSuitabilityResult
): TractorFitJson {
  const name = `${min.brand} ${min.model}`;
  const pros = generatePros(specs, result).slice(0, 5);
  const cons = generateCons(specs, result).slice(0, 5);
  const expertSummary = generateExpertSummary200300(specs, result, name);
  const whyThisScore = generateWhyThisScore(specs, result);
  const faq = generateFaq(specs, result, name);

  return {
    id: min.id,
    slug: min.slug,
    brand: min.brand,
    model: min.model,
    type: min.type,
    category: min.category,
    specs: {
      powerHP: min.engine.powerHP,
      fuelType: min.engine.fuelType ?? 'diesel',
      transmissionType: min.transmission.type,
      weightKg: min.weight,
      pumpFlowLmin: min.hydraulicSystem?.pumpFlow,
      liftCapacityKg: min.hydraulicSystem?.liftCapacity,
      ptoHP: min.ptoHP,
      ptoRPM: min.ptoRPM,
    },
    tractorFit: {
      overallScore: result.overallScore,
      smallFarmScore: result.smallFarmScore,
      largeFarmScore: result.largeFarmScore,
      loaderScore: result.loaderScore,
      fuelEfficiencyIndex: result.fuelEfficiency,
      maintenanceComplexity: result.maintenanceComplexity,
      versatilityIndex: result.versatilityIndex,
      powerToWeightScore: result.powerToWeightScore,
    },
    whyThisScore,
    pros,
    cons,
    expertSummary,
    faq,
  };
}
