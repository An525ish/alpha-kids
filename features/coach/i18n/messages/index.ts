import {
  DEFAULT_LOCALE,
  isLocaleCode,
  type LocaleCode,
} from "../../../../shared/i18n/locales";
import type { CoachCatalog, CoachMessages } from "../../types";
import { en } from "./en";
import { ur } from "./ur";

/**
 * Add a new language by:
 * 1. Extending LOCALE_CODES + LOCALES in shared/i18n/locales.ts
 * 2. Adding messages/<code>.ts implementing CoachMessages
 * 3. Registering it here
 * 4. Updating lib/server/coach schema + mock content if replies need that locale
 */
export const catalogs: CoachCatalog = {
  en,
  ur,
};

export function getMessages(locale: LocaleCode): CoachMessages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE];
}

export function resolveLocale(value: string | undefined): LocaleCode {
  if (value && isLocaleCode(value)) return value;
  return DEFAULT_LOCALE;
}
