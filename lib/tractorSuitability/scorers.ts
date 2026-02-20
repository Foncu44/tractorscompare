/**
 * TractorSuitability™ Engine - Deterministic scoring functions
 * All calculations are pure functions: same input → same output.
 */

import type { TractorSpecsInput, TransmissionType } from './types';

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Small Farm Suitability (0-100)
 * Best: HP < 60, lower weight, simpler transmission, good maneuverability.
 */
export function scoreSmallFarm(specs: TractorSpecsInput): number {
  const hp = specs.engine.powerHP;
  const weightKg = specs.weight ?? 1500;
  const weightT = weightKg / 1000;

  // Sweet spot 40-65 HP for small farms; penalize above 90
  let hpScore = 100;
  if (hp > 90) hpScore = Math.max(0, 100 - (hp - 90) * 2);
  else if (hp > 65) hpScore = 100 - (hp - 65);
  else if (hp < 35) hpScore = 35 + hp; // very low HP can be limiting
  // 35-65: full 100

  // Lighter is better for small farms (maneuverability, storage); cap penalty
  const weightScore = weightT <= 2 ? 100 : Math.max(30, 100 - (weightT - 2) * 15);

  return Math.round(clamp((hpScore * 0.6 + weightScore * 0.4), 0, 100));
}

/**
 * Large Farm Suitability (0-100)
 * Best: HP > 120, higher hydraulic flow, high PTO, strong lift capacity.
 */
export function scoreLargeFarm(specs: TractorSpecsInput): number {
  const hp = specs.engine.powerHP;
  const flow = specs.hydraulicSystem?.pumpFlow ?? 0;
  const lift = specs.hydraulicSystem?.liftCapacity ?? 0;
  const pto = specs.ptoHP ?? hp * 0.85;

  const hpScore = clamp((hp - 50) / 2.5, 0, 100); // 50→0, 300→100
  const flowScore = clamp(flow / 1.5, 0, 100);   // 150 L/min → 100
  const liftScore = clamp(lift / 50, 0, 100);     // 5000 kg → 100
  const ptoScore = clamp((pto / hp) * 120, 0, 100);

  return Math.round(clamp(
    hpScore * 0.5 + flowScore * 0.2 + liftScore * 0.15 + ptoScore * 0.15,
    0,
    100
  ));
}

/**
 * Loader Work Efficiency (0-100)
 * High weight + high hydraulic flow + good lift capacity (rear + front).
 */
export function scoreLoader(specs: TractorSpecsInput): number {
  const weightKg = specs.weight ?? 1500;
  const flow = specs.hydraulicSystem?.pumpFlow ?? 0;
  const rearLift = specs.hydraulicSystem?.liftCapacity ?? 0;
  const frontLift = specs.hydraulicSystem?.frontLiftCapacity ?? 0;

  const weightScore = clamp(weightKg / 40, 0, 100);        // 4000 kg → 100
  const flowScore = clamp(flow / 1.2, 0, 100);             // 120 L/min → 100
  const rearScore = clamp(rearLift / 45, 0, 100);          // 4500 kg → 100
  const frontScore = frontLift ? clamp(frontLift / 2000, 0, 100) : 40; // front optional

  return Math.round(clamp(
    weightScore * 0.25 + flowScore * 0.35 + rearScore * 0.25 + frontScore * 0.15,
    0,
    100
  ));
}

/**
 * Fuel Efficiency Index (0-100)
 * Diesel preferred, good power/weight, reasonable displacement/HP.
 */
export function scoreFuelEfficiency(specs: TractorSpecsInput): number {
  const hp = specs.engine.powerHP;
  const weightKg = specs.weight ?? 2000;
  const fuelType = specs.engine.fuelType ?? 'diesel';
  const displacement = specs.engine.displacement ?? hp * 0.05; // rough default

  const dieselBonus = fuelType === 'diesel' ? 15 : fuelType === 'electric' ? 25 : 0;
  const hpPerTon = weightKg > 0 ? (hp / (weightKg / 1000)) : 30;
  const powerToWeightScore = clamp(hpPerTon * 1.2, 0, 100);
  const literPerHP = displacement / hp;
  const efficiencyScore = literPerHP <= 0.04 ? 90 : clamp(100 - (literPerHP - 0.04) * 800, 0, 100);

  return Math.round(clamp(
    powerToWeightScore * 0.5 + efficiencyScore * 0.35 + 50 * 0.15 + dieselBonus,
    0,
    100
  ));
}

/**
 * Maintenance Complexity Score (0-100)
 * 0 = simplest (manual), 100 = most complex (CVT). Deterministic by transmission type.
 */
export function scoreMaintenanceComplexity(specs: TractorSpecsInput): number {
  const type: TransmissionType = specs.transmission?.type ?? 'manual';
  const base: Record<TransmissionType, number> = {
    manual: 12,
    powershift: 38,
    hydrostatic: 52,
    cvt: 88,
  };
  let score = base[type];
  const gears = specs.transmission.gears ?? 0;
  if (type === 'manual' && gears > 16) score += 8;
  if (type === 'cvt') score = Math.min(100, score + 5);
  return Math.round(clamp(score, 0, 100));
}

/**
 * Versatility Index (0-100)
 * Multiple PTO speeds, more valves, front PTO, high PTO/engine ratio.
 */
export function scoreVersatility(specs: TractorSpecsInput): number {
  const hp = specs.engine.powerHP;
  const ptoHP = specs.ptoHP ?? hp * 0.82;
  const ptoRatio = hp > 0 ? ptoHP / hp : 0;
  const hasMultiPto = (specs.ptoRearSpeeds ?? '').split(/[/&,]/).length >= 2 || (specs.ptoRPM === 1000 && (specs.ptoRearSpeeds ?? '').includes('540'));
  const valves = specs.hydraulicSystem?.rearValves ?? specs.hydraulicSystem?.valves ?? 0;
  const frontPto = !!(specs.ptoFront || specs.ptoFrontPower);

  let score = 50;
  score += ptoRatio * 25;                    // up to +24
  if (hasMultiPto) score += 15;
  if (frontPto) score += 10;
  score += Math.min(valves * 3, 15);
  return Math.round(clamp(score, 0, 100));
}

/**
 * Power-to-Weight Efficiency (0-100)
 * HP per metric ton; higher is better. Typical range ~20–80 HP/t.
 */
export function scorePowerToWeight(specs: TractorSpecsInput): number {
  const hp = specs.engine.powerHP;
  const weightKg = specs.weight ?? 2000;
  const weightT = weightKg > 0 ? weightKg / 1000 : 2;
  const hpPerTon = hp / weightT;
  const score = clamp((hpPerTon - 15) / 0.65, 0, 100);
  return Math.round(score);
}

/**
 * Cost Tier (0-100)
 * Higher = better value for money. Based on price range, HP per dollar, and transmission simplicity.
 */
export function scoreCostTier(specs: TractorSpecsInput): number {
  const hp = specs.engine.powerHP;
  const trans = specs.transmission?.type ?? 'manual';
  const priceMin = specs.priceRange?.min ?? specs.priceRange?.max;

  let basePriceScore = 50;
  let hpPerDollarScore = 25;

  if (priceMin != null && priceMin > 0) {
    if (priceMin < 25000) basePriceScore = 75;
    else if (priceMin < 50000) basePriceScore = 60;
    else if (priceMin < 100000) basePriceScore = 45;
    else basePriceScore = 25;

    const hpPerK = hp / (priceMin / 1000);
    hpPerDollarScore = clamp(hpPerK * 2.5, 0, 50);
  } else {
    hpPerDollarScore = clamp((hp / 80) * 25, 0, 50);
  }

  const transBonus: Record<TransmissionType, number> = {
    manual: 10,
    powershift: 0,
    hydrostatic: -5,
    cvt: -10,
  };
  const bonus = transBonus[trans] ?? 0;

  return Math.round(clamp(basePriceScore + hpPerDollarScore + bonus, 0, 100));
}

/**
 * Overall Suitability Score (0-100)
 * Weighted average of sub-scores; weights can be tuned for "general" use.
 */
export function scoreOverall(
  smallFarm: number,
  largeFarm: number,
  loader: number,
  fuelEfficiency: number,
  maintenanceComplexity: number,
  versatility: number,
  costTier: number,
  powerToWeight: number
): number {
  const simplicity = 100 - maintenanceComplexity;
  const combined =
    smallFarm * 0.11 +
    largeFarm * 0.14 +
    loader * 0.13 +
    fuelEfficiency * 0.13 +
    simplicity * 0.14 +
    versatility * 0.14 +
    costTier * 0.11 +
    powerToWeight * 0.10;
  return Math.round(clamp(combined, 0, 100));
}
