/**
 * TractorSuitability™ Engine - Type definitions
 * Input specs (subset of tractor data) and output analysis structure.
 */

export type TransmissionType = 'manual' | 'hydrostatic' | 'powershift' | 'cvt';

/** Minimal tractor specs required for suitability analysis */
export interface TractorSpecsInput {
  engine: {
    powerHP: number;
    fuelType?: 'diesel' | 'gasoline' | 'electric' | 'methane' | 'hybrid';
    displacement?: number;
    cylinders?: number;
  };
  transmission: {
    type: TransmissionType;
    gears?: number;
  };
  weight?: number; // kg
  hydraulicSystem?: {
    pumpFlow?: number; // L/min
    liftCapacity?: number; // kg
    frontLiftCapacity?: number; // kg
    rearValves?: number;
    rearValvesMax?: number;
    valves?: number;
  };
  ptoHP?: number;
  ptoRPM?: number;
  ptoRearSpeeds?: string; // e.g. "540 / 1000"
  ptoFront?: string;
  ptoFrontPower?: number;
  dimensions?: {
    length?: number;
    width?: number;
    wheelbase?: number;
    groundClearance?: number;
  };
  capacities?: {
    fuelTank?: number; // liters
  };
  /** Optional price range (USD) for Cost Tier scoring */
  priceRange?: {
    min?: number;
    max?: number;
  };
}

/** Full TractorSuitability™ analysis output */
export interface TractorSuitabilityResult {
  overallScore: number;
  smallFarmScore: number;
  largeFarmScore: number;
  loaderScore: number;
  fuelEfficiency: number;
  maintenanceComplexity: number;
  versatilityIndex: number;
  costTier: number;
  powerToWeightScore: number;
  pros: string[];
  cons: string[];
  expertSummary: string;
}
