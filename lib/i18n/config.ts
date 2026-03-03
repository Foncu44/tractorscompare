/**
 * i18n config: locales válidos y default.
 * No usar detección por Accept-Language para bots (solo redirect / -> defaultLocale).
 */
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
