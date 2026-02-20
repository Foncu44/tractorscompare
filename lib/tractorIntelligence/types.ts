/**
 * Tractor Intelligence Platform - Shared types
 */

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';

export type PrimaryUse =
  | 'hay'
  | 'dairy'
  | 'loader'
  | 'mixed'
  | 'row_crop'
  | 'livestock'
  | 'vineyard_orchard'
  | 'general';

export type TerrainType = 'flat' | 'hilly' | 'mixed';

/** User input for the Decision Simulator */
export interface DecisionSimulatorInput {
  farmSizeAcres: number;
  budgetMaxUSD?: number;
  primaryUse: PrimaryUse;
  terrain: TerrainType;
}

/** One recommended tractor with match score and reasons */
export interface RecommendationItem {
  rank: number;
  tractorId: string;
  slug: string;
  brand: string;
  model: string;
  matchScore: number;
  suitability: TractorSuitabilityResult;
  matchReasons: string[];
}

/** Decision Simulator API response */
export interface DecisionSimulatorResponse {
  request: DecisionSimulatorInput;
  recommendations: RecommendationItem[];
}

/** Full Performance Profile for a tractor (deterministic, from specs + suitability) */
export interface PerformanceProfile {
  tractorId: string;
  tractorName: string;
  pros: string[];
  cons: string[];
  idealUseCase: string;
  maintenanceTier: 'Low' | 'Moderate' | 'High' | 'Specialized';
  maintenanceTierDescription: string;
  operatingCostTier: 'Low' | 'Moderate' | 'Elevated' | 'Premium';
  operatingCostTierDescription: string;
  expertSummary: string;
}

/** Best category slug for programmatic SEO */
export type BestCategorySlug =
  | 'compact-tractors-under-50hp'
  | 'loader-tractors'
  | 'low-maintenance-tractors'
  | 'small-farm-tractors'
  | 'large-farm-tractors'
  | 'fuel-efficient-tractors'
  | 'versatile-mid-size-tractors';
