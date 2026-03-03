/**
 * Traducción simple con fallback e interpolación.
 * Uso: t('tractor.h1', { brand: 'Fendt', model: '822' }, 'es')
 * - Keys en formato "section.key".
 * - Interpolación: {{var}} o {var} en el valor.
 *
 * Cómo añadir nuevas keys:
 * 1. Añadir la key en messages/es.json y messages/en.json (misma estructura).
 * 2. Llamar t('section.key', { var: value }, locale).
 */

import type { Locale } from './config';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

type Messages = Record<string, Record<string, string> | string>;

const messages: Record<Locale, Messages> = {
  es: esMessages as Messages,
  en: enMessages as Messages,
};

function getNested(obj: Messages, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Traduce una key con opcional interpolación.
 * @param key - ej. "tractor.h1", "common.home"
 * @param vars - ej. { brand: 'Fendt', model: '822' } para "{{brand}} {{model}}"
 * @param locale - 'es' | 'en'
 * @returns texto traducido; si falta key, devuelve la key como fallback
 */
export function t(
  key: string,
  vars?: Record<string, string | number>,
  locale: Locale = 'en'
): string {
  const msgs = messages[locale];
  let value = getNested(msgs, key);
  if (value === undefined) {
    value = getNested(messages.en, key);
  }
  if (value === undefined) return key;
  if (!vars) return value;
  return value
    .replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ''))
    .replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
