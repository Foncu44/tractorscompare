/**
 * Deterministic SEO intro paragraph generator for tractor detail pages.
 * Produces 150–200 words containing the four core keyword intents:
 *   - "[model] specs"
 *   - "[model] price"
 *   - "[model] review"
 *   - "[brand] tractor"
 *
 * No AI — stable seed (FNV-1a) for phrase variation across thousands of tractors.
 */

import type { Tractor } from '@/types/tractor';

// FNV-1a 32-bit — same algorithm as tractorNarrative.ts for consistency
function fnv1a(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[Math.abs((seed + offset) % arr.length)];
}

// ---------------------------------------------------------------------------
// Phrase banks — English
// ---------------------------------------------------------------------------

const EN_OPEN_LEAD = [
  'The {fullName} is a {hp}{typeLabel} tractor built for {useContext}.',
  'Powered by a {hp}engine, the {fullName} is a {typeLabel} tractor designed for {useContext}.',
  'The {fullName} sits in the {powerBand} power class and is aimed at {useContext}.',
  'As a {typeLabel} tractor with {hp}of power, the {fullName} is built for {useContext}.',
];

const EN_BRAND_SENTENCE = [
  'As a {brand} tractor, the {model} continues the brand\'s reputation for reliability and field performance.',
  'The {brand} tractor lineup is known for durability, and the {model} is no exception.',
  'Built by {brand}, the {model} carries the engineering standards expected from this manufacturer.',
  '{brand} tractors are widely used across farm operations, and the {model} represents a strong entry in the {powerBand} segment.',
];

const EN_SPECS_SENTENCE = [
  'On this page you will find complete {fullName} specs including engine data, transmission type, hydraulic lift capacity, PTO output, dimensions, and operating weight.',
  'Below are the full {model} specs: engine specifications, transmission details, PTO ratings, hydraulic system data, and dimensions — everything you need for a buying decision.',
  'This page provides detailed {fullName} specifications — engine, transmission, PTO, hydraulics, weight, and dimensions — sourced from manufacturer technical data.',
  'Here you will find all {model} specs: engine displacement, fuel system, transmission gears, hydraulic flow, lift capacity, PTO speed, and tractor dimensions.',
];

const EN_REVIEW_SENTENCE = [
  'Our {model} review section below breaks down real-world strengths, trade-offs, and best use cases based on the technical specifications.',
  'Use the {fullName} review sections on this page — TractorFit analysis, pros and cons, and use-case ratings — to judge suitability before purchasing.',
  'The {model} review data on this page is generated from specifications, helping you understand how it compares to similar tractors in its class.',
  'Whether you need a {model} review for a purchase decision or a trade-in comparison, this page covers performance analysis and suitability scoring.',
];

const EN_PRICE_SENTENCE = [
  'For {fullName} price guidance, we provide new price estimates and used market ranges so you can budget accurately before contacting a dealer.',
  'Looking for the {model} price? Our used market section estimates current resale values, and the listings panel links to live marketplace data.',
  '{fullName} price varies by year, hours, condition, and region — our used price estimate gives you a data-based range to start your search.',
  'We include {model} price estimates — both new and used — to help you understand the cost of ownership and compare it against alternatives.',
];

const EN_CTA_SENTENCE = [
  'Use the comparison tool below to set the {fullName} against similar models, or browse the alternatives section for other tractors in this HP range.',
  'Compare the {fullName} with similar tractors using the links below, or use our TractorFit™ analysis to see how it scores for your specific operation.',
  'Scroll down for the complete {fullName} specification tables, suitability scores, price estimates, and links to similar tractors in our database.',
  'Use this page to review all {fullName} data in one place — from specs and pricing to suitability ratings and direct comparisons with competing models.',
];

// ---------------------------------------------------------------------------
// Phrase banks — Spanish
// ---------------------------------------------------------------------------

const ES_OPEN_LEAD = [
  'El {fullName} es un tractor {typeLabel} de {hp}diseñado para {useContext}.',
  'Con {hp}de potencia, el {fullName} es un tractor {typeLabel} orientado a {useContext}.',
  'El {fullName} se sitúa en la banda de potencia {powerBand} y está pensado para {useContext}.',
  'Como tractor {typeLabel} con {hp}de potencia, el {fullName} está construido para {useContext}.',
];

const ES_BRAND_SENTENCE = [
  'Como tractor {brand}, el {model} continúa la reputación de fiabilidad y rendimiento en campo de la marca.',
  'Los tractores {brand} son conocidos por su durabilidad, y el {model} no es una excepción.',
  'Fabricado por {brand}, el {model} cumple los estándares de ingeniería esperados de este fabricante.',
  'Los tractores {brand} son ampliamente utilizados en explotaciones agrícolas, y el {model} es una opción sólida en el segmento {powerBand}.',
];

const ES_SPECS_SENTENCE = [
  'En esta página encontrarás las especificaciones completas del {fullName}: motor, transmisión, capacidad de elevación hidráulica, TDF, dimensiones y peso de trabajo.',
  'A continuación se muestran las fichas del {model}: datos de motor, transmisión, TDF, hidráulica, peso y dimensiones para ayudarte en tu decisión de compra.',
  'Esta página incluye todas las especificaciones del {fullName}: cilindrada, sistema de combustible, marchas, caudal hidráulico, capacidad de elevación, velocidad TDF y dimensiones.',
  'Aquí encontrarás todos los datos técnicos del {model}: motor, transmisión, TDF, sistema hidráulico, capacidad de elevación, peso y dimensiones del tractor.',
];

const ES_REVIEW_SENTENCE = [
  'Nuestra sección de review del {model} detalla los puntos fuertes, contrapartidas y casos de uso reales basados en las especificaciones técnicas.',
  'Usa las secciones de review del {fullName} en esta página — análisis TractorFit, ventajas y desventajas, valoraciones de uso — para evaluar su idoneidad antes de comprar.',
  'Los datos de review del {model} en esta página se generan a partir de las especificaciones, permitiéndote compararlo con tractores similares de su clase.',
  'Tanto si necesitas un review del {model} para una decisión de compra como para una comparación, esta página cubre análisis de rendimiento y puntuación de adecuación.',
];

const ES_PRICE_SENTENCE = [
  'Para orientación sobre el precio del {fullName}, ofrecemos estimaciones de precio nuevo y rangos del mercado de ocasión para que puedas presupuestar con precisión.',
  '¿Buscas el precio del {model}? Nuestra sección de mercado de ocasión estima los valores de reventa actuales y el panel de anuncios enlaza con datos de mercado en tiempo real.',
  'El precio del {fullName} varía según el año, las horas, el estado y la región — nuestra estimación de precio de ocasión te da un rango basado en datos para empezar tu búsqueda.',
  'Incluimos estimaciones de precio del {model} — tanto nuevo como de ocasión — para ayudarte a entender el coste total y compararlo con alternativas.',
];

const ES_CTA_SENTENCE = [
  'Usa la herramienta de comparación para poner el {fullName} frente a modelos similares, o explora la sección de alternativas para ver otros tractores en esta gama de potencia.',
  'Compara el {fullName} con tractores similares usando los enlaces de abajo, o usa nuestro análisis TractorFit™ para ver cómo puntúa para tu explotación específica.',
  'Desplázate hacia abajo para ver todas las tablas de especificaciones del {fullName}, puntuaciones de adecuación, estimaciones de precio y enlaces a tractores similares.',
  'Usa esta página para revisar todos los datos del {fullName} en un solo lugar: especificaciones, precios, valoraciones de adecuación y comparaciones directas.',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function powerBandLabel(hp: number, locale: 'en' | 'es'): string {
  if (locale === 'es') {
    if (hp < 25) return 'baja potencia (menos de 25 CV)';
    if (hp <= 60) return '25–60 CV';
    if (hp <= 120) return '60–120 CV';
    if (hp <= 180) return '120–180 CV';
    return 'alta potencia (más de 180 CV)';
  }
  if (hp < 25) return 'sub-25 HP compact';
  if (hp <= 60) return '25–60 HP utility';
  if (hp <= 120) return '60–120 HP mid-range';
  if (hp <= 180) return '120–180 HP high-power';
  return '180+ HP large';
}

function typeLabel(type: string, locale: 'en' | 'es'): string {
  if (locale === 'es') {
    if (type === 'lawn') return 'de jardín';
    if (type === 'industrial') return 'industrial';
    return 'agrícola';
  }
  if (type === 'lawn') return 'lawn and garden';
  if (type === 'industrial') return 'industrial utility';
  return 'agricultural';
}

function useContext(type: string, hp: number, locale: 'en' | 'es'): string {
  if (locale === 'es') {
    if (type === 'lawn') return 'siega, mantenimiento de la propiedad y trabajos ligeros';
    if (type === 'industrial') return 'trabajos con pala, retroexcavadora y uso en obra';
    if (hp < 50) return 'explotaciones pequeñas, paisajismo y trabajo ligero con pala';
    if (hp <= 100) return 'trabajo de campo en explotaciones medianas, trabajo con pala y forraje';
    return 'explotaciones grandes, labranza pesada y compatibilidad con implementos de gran tamaño';
  }
  if (type === 'lawn') return 'mowing, property maintenance, and light attachments';
  if (type === 'industrial') return 'loader work, backhoe use, and site operations';
  if (hp < 50) return 'small farms, landscaping, and light loader duties';
  if (hp <= 100) return 'mid-size farm fieldwork, loader use, and hay operations';
  return 'large-acreage farming, heavy tillage, and large-implement compatibility';
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function buildIntroText(tractor: Tractor, locale: 'en' | 'es' = 'en'): string {
  const seed = fnv1a(tractor.slug + locale);
  const fullName = `${tractor.brand} ${tractor.model}`;
  const hp = tractor.engine?.powerHP;
  const hpStr = hp ? `${hp} ${locale === 'es' ? 'CV ' : 'HP '}` : '';
  const band = hp ? powerBandLabel(hp, locale) : (locale === 'es' ? 'uso general' : 'general use');
  const type = typeLabel(tractor.type, locale);
  const context = useContext(tractor.type, hp ?? 50, locale);

  const vars: Record<string, string> = {
    fullName,
    brand: tractor.brand,
    model: tractor.model,
    hp: hpStr,
    typeLabel: type,
    powerBand: band,
    useContext: context,
  };

  let sentences: string[];

  if (locale === 'es') {
    sentences = [
      interpolate(pick(ES_OPEN_LEAD, seed, 0), vars),
      interpolate(pick(ES_BRAND_SENTENCE, seed, 1), vars),
      interpolate(pick(ES_SPECS_SENTENCE, seed, 2), vars),
      interpolate(pick(ES_REVIEW_SENTENCE, seed, 3), vars),
      interpolate(pick(ES_PRICE_SENTENCE, seed, 4), vars),
      interpolate(pick(ES_CTA_SENTENCE, seed, 5), vars),
    ];
  } else {
    sentences = [
      interpolate(pick(EN_OPEN_LEAD, seed, 0), vars),
      interpolate(pick(EN_BRAND_SENTENCE, seed, 1), vars),
      interpolate(pick(EN_SPECS_SENTENCE, seed, 2), vars),
      interpolate(pick(EN_REVIEW_SENTENCE, seed, 3), vars),
      interpolate(pick(EN_PRICE_SENTENCE, seed, 4), vars),
      interpolate(pick(EN_CTA_SENTENCE, seed, 5), vars),
    ];
  }

  return sentences.join(' ');
}
