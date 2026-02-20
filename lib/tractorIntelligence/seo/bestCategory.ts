/**
 * Best category SEO - Filter tractors by category, score, and generate analytical content
 */

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';
import type { BestCategorySlug } from '../types';

export interface TractorWithSuitability {
  id: string;
  slug: string;
  brand: string;
  model: string;
  engine: { powerHP: number };
  suitability: TractorSuitabilityResult;
}

export interface BestCategoryConfig {
  slug: BestCategorySlug;
  title: string;
  description: string;
  filter: (t: TractorWithSuitability) => boolean;
  sortScore: (t: TractorWithSuitability) => number;
  introTemplate: (count: number, topHP?: number, lowHP?: number) => string;
}

export const BEST_CATEGORIES: BestCategoryConfig[] = [
  {
    slug: 'compact-tractors-under-50hp',
    title: 'Best Compact Tractors Under 50 HP',
    description: 'Top-rated compact tractors under 50 HP by TractorSuitability™ scores. Compare specs and suitability for small farms and landscaping.',
    filter: (t) => t.engine.powerHP < 50 && t.suitability.smallFarmScore >= 60,
    sortScore: (t) => t.suitability.smallFarmScore * 0.6 + t.suitability.overallScore * 0.4,
    introTemplate: (count, _topHP, lowHP) =>
      `These ${count} compact tractors rank highest for small-farm suitability and overall balance when limited to under 50 HP. Ideal for properties under roughly 20 acres, mowing, light loader work, and maneuverability.${lowHP != null ? ` Power range includes models from ${lowHP} HP.` : ''}`,
  },
  {
    slug: 'loader-tractors',
    title: 'Best Tractors for Loader Work',
    description: 'Top tractors for loader and material handling by hydraulic capacity and TractorSuitability™ loader score.',
    filter: (t) => t.suitability.loaderScore >= 55,
    sortScore: (t) => t.suitability.loaderScore * 0.7 + t.suitability.versatilityIndex * 0.3,
    introTemplate: (count) =>
      `These ${count} tractors score highest for loader work in the TractorSuitability™ Engine, based on hydraulic flow, rear and front lift capacity, and weight. Suitable for material handling, hay, and utility work.`,
  },
  {
    slug: 'low-maintenance-tractors',
    title: 'Best Low-Maintenance Tractors',
    description: 'Tractors with lowest maintenance complexity: simple transmissions and lower repair costs.',
    filter: (t) => t.suitability.maintenanceComplexity <= 45,
    sortScore: (t) => 100 - t.suitability.maintenanceComplexity + t.suitability.overallScore * 0.3,
    introTemplate: (count) =>
      `These ${count} tractors have the lowest maintenance complexity scores, typically featuring mechanical or powershift transmissions and lower long-term repair costs.`,
  },
  {
    slug: 'small-farm-tractors',
    title: 'Best Tractors for Small Farms',
    description: 'Top tractors for small and mid-size farms by TractorSuitability™ small-farm score.',
    filter: (t) => t.suitability.smallFarmScore >= 65,
    sortScore: (t) => t.suitability.smallFarmScore * 0.5 + t.suitability.overallScore * 0.5,
    introTemplate: (count, topHP, lowHP) =>
      `These ${count} tractors rank highest for small-farm fit: maneuverability, power class, and running costs.${lowHP != null && topHP != null ? ` Power range from ${lowHP} to ${topHP} HP.` : ''}`,
  },
  {
    slug: 'large-farm-tractors',
    title: 'Best Tractors for Large Farms',
    description: 'Top tractors for large acreage and heavy fieldwork by power and hydraulic capacity.',
    filter: (t) => t.suitability.largeFarmScore >= 50,
    sortScore: (t) => t.suitability.largeFarmScore * 0.6 + t.suitability.overallScore * 0.4,
    introTemplate: (count, topHP) =>
      `These ${count} tractors score highest for large-farm suitability: power, hydraulic flow, and PTO capacity.${topHP != null ? ` Up to ${topHP} HP in this selection.` : ''}`,
  },
  {
    slug: 'fuel-efficient-tractors',
    title: 'Best Fuel-Efficient Tractors',
    description: 'Tractors with highest fuel efficiency index from the TractorSuitability™ Engine.',
    filter: (t) => t.suitability.fuelEfficiency >= 60,
    sortScore: (t) => t.suitability.fuelEfficiency * 0.6 + t.suitability.overallScore * 0.4,
    introTemplate: (count) =>
      `These ${count} tractors have the highest fuel efficiency indices in our database, based on engine type, power-to-weight, and displacement per HP.`,
  },
  {
    slug: 'versatile-mid-size-tractors',
    title: 'Best Versatile Mid-Size Tractors',
    description: 'Mid-size tractors with highest versatility index: multiple PTO and hydraulic options.',
    filter: (t) => {
      const hp = t.engine.powerHP;
      return hp >= 40 && hp <= 120 && t.suitability.versatilityIndex >= 60;
    },
    sortScore: (t) => t.suitability.versatilityIndex * 0.5 + t.suitability.overallScore * 0.5,
    introTemplate: (count) =>
      `These ${count} mid-size tractors (roughly 40–120 HP) rank highest for versatility: PTO options, hydraulic valves, and suitability for mixed implement use.`,
  },
];

export function getBestCategoryConfig(
  slug: string
): BestCategoryConfig | undefined {
  return BEST_CATEGORIES.find((c) => c.slug === slug);
}

export function getTractorsForBestCategory(
  tractorsWithSuitability: TractorWithSuitability[],
  categorySlug: string,
  limit: number = 20
): { tractors: TractorWithSuitability[]; config: BestCategoryConfig } | null {
  const config = getBestCategoryConfig(categorySlug);
  if (!config) return null;

  const filtered = tractorsWithSuitability.filter(config.filter);
  filtered.sort((a, b) => config.sortScore(b) - config.sortScore(a));
  const tractors = filtered.slice(0, limit);

  return { tractors, config };
}

export function generateBestCategoryContent(
  tractors: TractorWithSuitability[],
  config: BestCategoryConfig
): { intro: string; closing: string } {
  const count = tractors.length;
  const hpList = tractors.map((t) => t.engine.powerHP).filter((n) => n > 0);
  const lowHP = hpList.length ? Math.min(...hpList) : undefined;
  const topHP = hpList.length ? Math.max(...hpList) : undefined;

  const intro = config.introTemplate(count, topHP, lowHP);

  const closing =
    'All scores are computed by the TractorSuitability™ Engine from manufacturer specifications only. Compare individual tractor pages for full specs and suitability breakdowns.';

  return { intro, closing };
}
