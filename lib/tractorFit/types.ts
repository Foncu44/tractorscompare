/**
 * TractorFit™ Intelligence Layer - Types for build pipeline and static pages
 */

export interface TractorMin {
  id: string;
  slug: string;
  brand: string;
  model: string;
  type: 'farm' | 'lawn' | 'industrial';
  category?: string;
  engine: {
    powerHP: number;
    fuelType?: 'diesel' | 'gasoline' | 'electric' | 'methane' | 'hybrid';
    displacement?: number;
    cylinders?: number;
  };
  transmission: { type: string; gears?: number };
  weight?: number;
  hydraulicSystem?: {
    pumpFlow?: number;
    liftCapacity?: number;
    frontLiftCapacity?: number;
    rearValves?: number;
    valves?: number;
  };
  ptoHP?: number;
  ptoRPM?: number;
  ptoRearSpeeds?: string;
  ptoFront?: string;
  ptoFrontPower?: number;
  priceRange?: { min?: number; max?: number };
  imageUrl?: string;
}

export interface SlugsFile {
  slugToId: Record<string, string>;
  entries: { id: string; slug: string }[];
}

export interface TractorFitScores {
  overallScore: number;
  smallFarmScore: number;
  largeFarmScore: number;
  loaderScore: number;
  fuelEfficiencyIndex: number;
  maintenanceComplexity: number;
  versatilityIndex: number;
  powerToWeightScore: number;
}

export interface TractorFitJson {
  id: string;
  slug: string;
  brand: string;
  model: string;
  type: string;
  category?: string;
  /** Key specs for display */
  specs: {
    powerHP: number;
    fuelType: string;
    transmissionType: string;
    weightKg?: number;
    pumpFlowLmin?: number;
    liftCapacityKg?: number;
    ptoHP?: number;
    ptoRPM?: number;
  };
  tractorFit: TractorFitScores;
  whyThisScore: string[];
  pros: string[];
  cons: string[];
  expertSummary: string;
  faq: { q: string; a: string }[];
}

export type IndexEntry = { id: string; slug: string; score: number; brand?: string; model?: string; powerHP?: number };

export type BestCategorySlug =
  | 'loader-work'
  | '20-acres'
  | 'under-60-hp'
  | '100-hp'
  | 'utility';
