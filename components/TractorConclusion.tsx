/**
 * Conclusion / recommendation section for tractor detail pages.
 * Server component — static HTML for crawlers.
 *
 * Generates a short 2–3 sentence recommendation from:
 *   - Overall suitability score
 *   - Best-for use cases (from narrative)
 *   - Price availability
 */

import type { Tractor } from '@/types/tractor';

interface SuitabilityResult {
  overallScore: number;
  smallFarmScore: number;
  largeFarmScore: number;
}

interface Props {
  tractor: Tractor;
  suitabilityResult: SuitabilityResult;
  bestFor: string[];
  locale?: 'en' | 'es';
}

function buildConclusionText(
  tractor: Tractor,
  suitabilityResult: SuitabilityResult,
  bestFor: string[],
  locale: 'en' | 'es'
): string {
  const fullName = `${tractor.brand} ${tractor.model}`;
  const score = suitabilityResult.overallScore;
  const hp = tractor.engine?.powerHP;
  const hasPrice = Boolean(tractor.priceRange?.min || tractor.priceRange?.max);
  const bestForJoined = bestFor.slice(0, 3).join(locale === 'es' ? ', ' : ', ');

  if (locale === 'es') {
    const scoreTier =
      score >= 75
        ? 'una opción muy recomendable'
        : score >= 55
          ? 'una opción sólida'
          : 'una opción a considerar con precaución';

    const hpLine = hp
      ? `Con ${hp} CV, el ${fullName} es ${scoreTier} para operadores que necesitan ${bestForJoined || 'uso agrícola general'}.`
      : `El ${fullName} es ${scoreTier} para operadores que necesitan ${bestForJoined || 'uso agrícola general'}.`;

    const priceLine = hasPrice
      ? ` Consulta el rango de precios indicado en la parte superior y compara con modelos similares para asegurarte de que se ajusta a tu presupuesto.`
      : ` Verifica el precio actual con tu distribuidor local y compara con las alternativas listadas en esta página.`;

    const compareLine = ` Usa nuestra herramienta de comparación para evaluar el ${tractor.model} frente a otros tractores en la misma gama de potencia antes de tomar una decisión.`;

    return hpLine + priceLine + compareLine;
  }

  // English
  const scoreTier =
    score >= 75
      ? 'a highly recommended choice'
      : score >= 55
        ? 'a solid choice'
        : 'a model worth considering carefully';

  const hpLine = hp
    ? `With ${hp} HP, the ${fullName} is ${scoreTier} for operators who need ${bestForJoined || 'general farm work'}.`
    : `The ${fullName} is ${scoreTier} for operators who need ${bestForJoined || 'general farm work'}.`;

  const priceLine = hasPrice
    ? ` Check the price range shown above and compare with similar models to ensure it fits your budget.`
    : ` Verify current pricing with your local dealer and weigh it against the alternatives listed on this page.`;

  const compareLine = ` Use our comparison tool to stack the ${tractor.model} against other tractors in the same HP range before making a final decision.`;

  return hpLine + priceLine + compareLine;
}

export default function TractorConclusion({ tractor, suitabilityResult, bestFor, locale = 'en' }: Props) {
  const text = buildConclusionText(tractor, suitabilityResult, bestFor, locale);
  const heading = locale === 'es' ? 'Conclusión' : 'Conclusion';

  return (
    <section
      className="mt-8 md:mt-12 bg-primary-50 rounded-xl border border-primary-200 p-4 md:p-6"
      aria-labelledby="conclusion-heading"
    >
      <h2 id="conclusion-heading" className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
        {heading}
      </h2>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
        {text}
      </p>
    </section>
  );
}
