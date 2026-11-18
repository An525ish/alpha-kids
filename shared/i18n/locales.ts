export const LOCALE_CODES = ["en", "ur"] as const;

export type LocaleCode = (typeof LOCALE_CODES)[number];

export type LocaleMeta = {
  code: LocaleCode;
  /** Full name shown in the language toggle (in that language). */
  label: string;
  /** Short chip label for compact layouts. */
  shortLabel: string;
  dir: "ltr" | "rtl";
};

/** Registry of supported UI / reply languages. Add a locale here first. */
export const LOCALES: readonly LocaleMeta[] = [
  { code: "en", label: "English", shortLabel: "EN", dir: "ltr" },
  { code: "ur", label: "اردو", shortLabel: "اردو", dir: "rtl" },
] as const;

export const DEFAULT_LOCALE: LocaleCode = "en";

export function isLocaleCode(value: string): value is LocaleCode {
  return (LOCALE_CODES as readonly string[]).includes(value);
}

export function getLocaleMeta(code: LocaleCode): LocaleMeta {
  const found = LOCALES.find((locale) => locale.code === code);
  if (!found) {
    return LOCALES[0]!;
  }
  return found;
}

export function isRtlLocale(code: LocaleCode): boolean {
  return getLocaleMeta(code).dir === "rtl";
}
