'use client';

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Home,
  Building2,
  Loader2,
  Fuel,
  Wrench,
  Layers,
  Zap,
  DollarSign,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { t } from '@/lib/i18n/t';

export interface PerformanceProfileDisplay {
  idealUseCase: string;
  maintenanceTier: string;
  maintenanceTierDescription: string;
  operatingCostTier: string;
  operatingCostTierDescription: string;
  expertSummary: string;
}

export interface TractorFitPanelProps {
  locale?: Locale;
  result: TractorSuitabilityResult;
  tractorName: string;
  /** Short deterministic interpretation (90–130 words) */
  fitInterpretation: string;
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

const SUB_SCORE_KEYS: { key: keyof TractorSuitabilityResult; labelKey: string; icon: React.ReactNode }[] = [
  { key: 'smallFarmScore', labelKey: 'tractorFit.smallFarmSuitability', icon: <Home className="h-4 w-4" /> },
  { key: 'largeFarmScore', labelKey: 'tractorFit.largeFarmSuitability', icon: <Building2 className="h-4 w-4" /> },
  { key: 'loaderScore', labelKey: 'tractorFit.loaderWorkEfficiency', icon: <Loader2 className="h-4 w-4" /> },
  { key: 'fuelEfficiency', labelKey: 'tractorFit.fuelEfficiency', icon: <Fuel className="h-4 w-4" /> },
  { key: 'maintenanceComplexity', labelKey: 'tractorFit.maintenanceEase', icon: <Wrench className="h-4 w-4" /> },
  { key: 'versatilityIndex', labelKey: 'tractorFit.versatility', icon: <Layers className="h-4 w-4" /> },
  { key: 'costTier', labelKey: 'tractorFit.costTier', icon: <DollarSign className="h-4 w-4" /> },
  { key: 'powerToWeightScore', labelKey: 'tractorFit.powerToWeight', icon: <Zap className="h-4 w-4" /> },
];

export default function TractorFitPanel({
  locale = 'en',
  result,
  tractorName,
  fitInterpretation,
  profile,
}: TractorFitPanelProps) {
  const maintenanceDisplay = 100 - result.maintenanceComplexity;

  return (
    <section
      className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-10"
      aria-labelledby="tractorfit-heading"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <BarChart3 className="h-6 w-6 text-primary-700" aria-hidden />
        <h2 id="tractorfit-heading" className="text-xl md:text-2xl font-bold text-gray-900">
          {t('tractorFit.title', undefined, locale)}
        </h2>
      </div>

      {/* Overall score */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-6">
        <div
          className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-2xl md:text-3xl ${scoreColor(result.overallScore)}`}
          aria-label={`Overall TractorFit score: ${result.overallScore} out of 100`}
        >
          {result.overallScore}
        </div>
        <div>
          <p className="text-sm md:text-base font-semibold text-gray-900">{t('tractorFit.overallScore', undefined, locale)}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            {t('tractorFit.basedOnSpecs', { name: tractorName }, locale)}
          </p>
        </div>
      </div>

      {/* Interpretation paragraph */}
      <div className="mb-6 md:mb-8">
        <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-3xl">
          {fitInterpretation}
        </p>
      </div>

      {/* Sub-scores grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {SUB_SCORE_KEYS.map(({ key, labelKey, icon }) => {
          const value = key === 'maintenanceComplexity' ? maintenanceDisplay : (result[key] as number | undefined) ?? 0;
          const isMaintenance = key === 'maintenanceComplexity';
          return (
            <div key={key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 mb-1">
                <span className="text-primary-700" aria-hidden>{icon}</span>
                <span className="text-xs font-medium">{t(labelKey, undefined, locale)}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-lg font-bold ${scoreColor(value)}`}>{Math.round(value)}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
              <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${scoreBarColor(value)}`}
                  style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                  role="progressbar"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              {isMaintenance && <p className="text-xs text-gray-500 mt-0.5">{t('tractorFit.higherSimpler', undefined, locale)}</p>}
            </div>
          );
        })}
      </div>

      {/* Pros & Cons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/60">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
            <ThumbsUp className="h-4 w-4 text-green-700" /> {t('tractorFit.pros', undefined, locale)}
          </h3>
          {result.pros.length > 0 ? (
            <ul className="space-y-1 text-sm text-gray-700">
              {result.pros.map((pro, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t('tractorFit.noStrengths', undefined, locale)}</p>
          )}
        </div>
        <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200/60">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
            <ThumbsDown className="h-4 w-4 text-amber-700" /> {t('tractorFit.cons', undefined, locale)}
          </h3>
          {result.cons.length > 0 ? (
            <ul className="space-y-1 text-sm text-gray-700">
              {result.cons.map((con, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-600 flex-shrink-0">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t('tractorFit.noLimitations', undefined, locale)}</p>
          )}
        </div>
      </div>

      {profile?.expertSummary && (
        <div className="bg-primary-50/50 rounded-lg p-4 border border-primary-200/60">
          <p className="text-sm text-gray-700 leading-relaxed">{profile.expertSummary}</p>
        </div>
      )}
    </section>
  );
}
