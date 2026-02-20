/**
 * Tractor Intelligence Platform - Public API
 */

export type {
  DecisionSimulatorInput,
  DecisionSimulatorResponse,
  RecommendationItem,
  PerformanceProfile,
  PrimaryUse,
  TerrainType,
  BestCategorySlug,
} from './types';

export { buildPerformanceProfile } from './profile';
export { recommendTopTractors } from './recommendation';

export {
  getBestCategoryConfig,
  getTractorsForBestCategory,
  generateBestCategoryContent,
  BEST_CATEGORIES,
} from './seo/bestCategory';
export type { TractorWithSuitability as BestCategoryTractor } from './seo/bestCategory';

export { generateComparePageContent } from './seo/compare';
export type { TractorCompareItem } from './seo/compare';

export {
  getTopTractorsByScore,
  getGuideAnalyticalSnippet,
  getLoaderScoreSpecRanges,
  getSmallFarmSpecRanges,
  getFuelEfficiencySpecRanges,
} from './seo/guide';
export type { TractorWithSuitability as GuideTractor } from './seo/guide';
