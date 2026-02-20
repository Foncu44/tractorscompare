/**
 * Compare page SEO - Generate analytical content for tractor A vs tractor B
 */

import type { TractorSuitabilityResult } from '@/lib/tractorSuitability';

export interface TractorCompareItem {
  id: string;
  slug: string;
  brand: string;
  model: string;
  suitability: TractorSuitabilityResult;
}

export function generateComparePageContent(
  tractorA: TractorCompareItem,
  tractorB: TractorCompareItem
): {
  title: string;
  metaDescription: string;
  intro: string;
  summaryParagraph: string;
  winnerByCategory: { category: string; winner: 'A' | 'B' | 'tie'; text: string }[];
} {
  const nameA = `${tractorA.brand} ${tractorA.model}`;
  const nameB = `${tractorB.brand} ${tractorB.model}`;
  const title = `${nameA} vs ${nameB}: Comparison`;
  const metaDescription = `Compare ${nameA} and ${nameB} with TractorSuitability™ scores: small farm, loader, fuel efficiency, versatility, and specs.`;

  const intro = `Side-by-side comparison of the ${nameA} and the ${nameB} using TractorSuitability™ scores and key specifications. Both models are evaluated on the same criteria for an objective comparison.`;

  const a = tractorA.suitability;
  const b = tractorB.suitability;

  const categories: { key: keyof TractorSuitabilityResult; label: string }[] = [
    { key: 'overallScore', label: 'Overall' },
    { key: 'smallFarmScore', label: 'Small farm fit' },
    { key: 'largeFarmScore', label: 'Large farm fit' },
    { key: 'loaderScore', label: 'Loader work' },
    { key: 'fuelEfficiency', label: 'Fuel efficiency' },
    { key: 'versatilityIndex', label: 'Versatility' },
    { key: 'costTier', label: 'Cost tier' },
    { key: 'powerToWeightScore', label: 'Power-to-weight' },
  ];

  const winnerByCategory: { category: string; winner: 'A' | 'B' | 'tie'; text: string }[] = [];

  for (const { key, label } of categories) {
    const va = a[key] as number | undefined;
    const vb = b[key] as number | undefined;
    if (va == null || vb == null) continue;
    let winner: 'A' | 'B' | 'tie' = 'tie';
    if (va > vb) winner = 'A';
    else if (vb > va) winner = 'B';
    const winnerName = winner === 'A' ? nameA : winner === 'B' ? nameB : 'Both tie';
    winnerByCategory.push({
      category: label,
      winner,
      text: `${winnerName} (${winner === 'tie' ? va : winner === 'A' ? va : vb}/100)`,
    });
  }

  const aWins = winnerByCategory.filter((w) => w.winner === 'A').length;
  const bWins = winnerByCategory.filter((w) => w.winner === 'B').length;

  let summaryParagraph: string;
  if (aWins > bWins) {
    summaryParagraph = `The ${nameA} leads in more suitability categories (${aWins} vs ${bWins}), with advantages in ${winnerByCategory.filter((w) => w.winner === 'A').map((w) => w.category.toLowerCase()).join(', ')}. The ${nameB} remains competitive in other areas; choose based on your priority (e.g. loader work, fuel efficiency, or cost tier).`;
  } else if (bWins > aWins) {
    summaryParagraph = `The ${nameB} leads in more categories (${bWins} vs ${aWins}), with strengths in ${winnerByCategory.filter((w) => w.winner === 'B').map((w) => w.category.toLowerCase()).join(', ')}. The ${nameA} may still suit if your priorities align with its stronger scores.`;
  } else {
    summaryParagraph = `Both tractors show a balanced spread of scores. The ${nameA} and ${nameB} each lead in different areas; match your choice to your primary use (e.g. small farm, loader, or fuel economy).`;
  }

  return {
    title,
    metaDescription,
    intro,
    summaryParagraph,
    winnerByCategory,
  };
}
