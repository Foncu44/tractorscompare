'use client';

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Home,
  Building2,
  Loader2,
  Fuel,
  Wrench,
  Layers,
  Zap,
  DollarSign,
  Target,
} from 'lucide-react';

export interface PerformanceProfileDisplay {
  idealUseCase: string;
  maintenanceTier: string;
  maintenanceTierDescription: string;
  operatingCostTier: string;
  operatingCostTierDescription: string;
  expertSummary: string;
}

interface TractorSuitabilitySectionProps {
  result: TractorSuitabilityResult;
  tractorName: string;
  profile?: PerformanceProfileDisplay | null;
}

const scoreColor = (score: number) => {
  if (score >= 70) return 'text-green-700 bg-green-100';
  if (score >= 50) return 'text-amber-700 bg-amber-100';
  return 'text-red-700 bg-red-100';
};

const scoreBarColor = (score: number) => {
  if (score >= 70) return 'bg-green-600';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

const SUB_SCORES: { key: keyof TractorSuitabilityResult; label: string; icon: React.ReactNode }[] = [
  { key: 'smallFarmScore', label: 'Small farm suitability', icon: <Home className="h-4 w-4" /> },
  { key: 'largeFarmScore', label: 'Large farm suitability', icon: <Building2 className="h-4 w-4" /> },
  { key: 'loaderScore', label: 'Loader work efficiency', icon: <Loader2 className="h-4 w-4" /> },
  { key: 'fuelEfficiency', label: 'Fuel efficiency', icon: <Fuel className="h-4 w-4" /> },
  { key: 'maintenanceComplexity', label: 'Maintenance ease', icon: <Wrench className="h-4 w-4" /> },
  { key: 'versatilityIndex', label: 'Versatility', icon: <Layers className="h-4 w-4" /> },
  { key: 'costTier', label: 'Cost tier', icon: <DollarSign className="h-4 w-4" /> },
  { key: 'powerToWeightScore', label: 'Power-to-weight', icon: <Zap className="h-4 w-4" /> },
];

export default function TractorSuitabilitySection({ result, tractorName, profile }: TractorSuitabilitySectionProps) {
  const maintenanceDisplay = 100 - result.maintenanceComplexity;

  return (
    <section
      className="bg-white rounded-card border border-gray-200 shadow-card p-4 md:p-6 mb-6 md:mb-10"
      aria-labelledby="suitability-heading"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4 md:mb-6">
        <BarChart3 className="h-6 w-6 text-primary-700" aria-hidden />
        <h2 id="suitability-heading" className="text-xl md:text-2xl font-bold text-gray-900">
          TractorSuitability™
        </h2>
        <span className="text-xs text-gray-500 font-normal">Suitability analysis</span>
      </div>

      {/* Overall score */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-6 md:mb-8">
        <div
          className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl ${scoreColor(result.overallScore)}`}
          aria-label={`Overall suitability score: ${result.overallScore} out of 100`}
        >
          {result.overallScore}
        </div>
        <div>
          <p className="text-sm md:text-base font-semibold text-gray-900">Overall suitability score</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Index calculated from technical specifications for {tractorName}.
          </p>
        </div>
      </div>

      {/* Sub-scores grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {SUB_SCORES.map(({ key, label, icon }) => {
          const value = key === 'maintenanceComplexity' ? maintenanceDisplay : (result[key] as number | undefined) ?? 0;
          const isMaintenance = key === 'maintenanceComplexity';
          return (
            <div
              key={key}
              className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200"
            >
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <span className="text-primary-700" aria-hidden>{icon}</span>
                <span className="text-xs md:text-sm font-medium">{label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-lg md:text-xl font-bold ${scoreColor(value)}`}>
                  {Math.round(value)}
                </span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${scoreBarColor(value)}`}
                  style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${label}: ${value} out of 100`}
                />
              </div>
              {isMaintenance && (
                <p className="text-xs text-gray-500 mt-1">Higher = simpler maintenance</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Pros & Cons */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/60">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
            <ThumbsUp className="h-4 w-4 text-green-700" aria-hidden />
            Pros
          </h3>
          {result.pros.length > 0 ? (
            <ul className="space-y-2">
              {result.pros.map((pro, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No major strengths identified.</p>
          )}
        </div>
        <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200/60">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
            <ThumbsDown className="h-4 w-4 text-amber-700" aria-hidden />
            Cons
          </h3>
          {result.cons.length > 0 ? (
            <ul className="space-y-2">
              {result.cons.map((con, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-amber-600 flex-shrink-0 mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No major limitations identified.</p>
          )}
        </div>
      </div>

      {/* Performance profile: ideal use case, tiers (when available) */}
      {profile && (
        <div className="space-y-4 mb-6 md:mb-8">
          <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
            <Target className="h-4 w-4 text-primary-700" aria-hidden />
            Performance profile
          </h3>
          <p className="text-sm text-gray-700"><strong>Ideal use case:</strong> {profile.idealUseCase}</p>
          <p className="text-sm text-gray-700"><strong>Maintenance tier:</strong> {profile.maintenanceTier} — {profile.maintenanceTierDescription}</p>
          <p className="text-sm text-gray-700"><strong>Operating cost tier:</strong> {profile.operatingCostTier} — {profile.operatingCostTierDescription}</p>
        </div>
      )}

      {/* Expert summary (extended from profile if available) */}
      <div className="bg-primary-50/50 rounded-lg p-4 md:p-6 border border-primary-200/60">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
          <FileText className="h-4 w-4 text-primary-700" aria-hidden />
          Expert summary
        </h3>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
          {profile?.expertSummary ?? result.expertSummary}
        </p>
      </div>
    </section>
  );
}
