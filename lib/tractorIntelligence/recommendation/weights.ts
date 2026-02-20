/**
 * Weights for Decision Simulator - by primary use, farm size band, and terrain
 */

import type { PrimaryUse, TerrainType } from '../types';

export type FarmSizeBand = 'small' | 'mid' | 'large';

export function getFarmSizeBand(acres: number): FarmSizeBand {
  if (acres < 50) return 'small';
  if (acres < 200) return 'mid';
  return 'large';
}

/** Weights for each suitability sub-score (must sum to 1.0) */
export interface ScoreWeights {
  smallFarm: number;
  largeFarm: number;
  loader: number;
  fuelEfficiency: number;
  maintenanceSimplicity: number; // 100 - maintenanceComplexity
  versatility: number;
  costTier: number;
  powerToWeight: number;
}

export function getWeightsForUseCase(
  primaryUse: PrimaryUse,
  farmSize: FarmSizeBand,
  terrain: TerrainType
): ScoreWeights {
  const powerToWeightBoost = terrain === 'hilly' ? 0.12 : terrain === 'mixed' ? 0.06 : 0.04;
  const base: ScoreWeights = {
    smallFarm: 0.10,
    largeFarm: 0.10,
    loader: 0.12,
    fuelEfficiency: 0.12,
    maintenanceSimplicity: 0.12,
    versatility: 0.14,
    costTier: 0.14,
    powerToWeight: 0.16,
  };

  switch (primaryUse) {
    case 'hay':
      base.versatility += 0.08;
      base.loader += 0.04;
      base.fuelEfficiency += 0.04;
      break;
    case 'dairy':
      base.versatility += 0.10;
      base.smallFarm += 0.04;
      base.loader += 0.02;
      break;
    case 'loader':
      base.loader += 0.20;
      base.versatility += 0.04;
      base.smallFarm += 0.02;
      break;
    case 'mixed':
      base.versatility += 0.08;
      base.loader += 0.04;
      base.fuelEfficiency += 0.02;
      break;
    case 'row_crop':
      base.largeFarm += 0.12;
      base.fuelEfficiency += 0.04;
      break;
    case 'livestock':
      base.versatility += 0.06;
      base.loader += 0.06;
      base.smallFarm += 0.02;
      break;
    case 'vineyard_orchard':
      base.smallFarm += 0.10;
      base.versatility += 0.04;
      base.loader += 0.02;
      break;
    case 'general':
    default:
      break;
  }

  if (farmSize === 'small') {
    base.smallFarm += 0.12;
    base.largeFarm -= 0.08;
    base.costTier += 0.04;
  } else if (farmSize === 'large') {
    base.largeFarm += 0.12;
    base.smallFarm -= 0.06;
    base.loader += 0.02;
  }

  base.powerToWeight += powerToWeightBoost;
  base.fuelEfficiency -= powerToWeightBoost * 0.5;
  base.versatility -= powerToWeightBoost * 0.5;

  const sum =
    base.smallFarm +
    base.largeFarm +
    base.loader +
    base.fuelEfficiency +
    base.maintenanceSimplicity +
    base.versatility +
    base.costTier +
    base.powerToWeight;
  if (Math.abs(sum - 1) > 0.01) {
    const scale = 1 / sum;
    base.smallFarm *= scale;
    base.largeFarm *= scale;
    base.loader *= scale;
    base.fuelEfficiency *= scale;
    base.maintenanceSimplicity *= scale;
    base.versatility *= scale;
    base.costTier *= scale;
    base.powerToWeight *= scale;
  }

  return base;
}
