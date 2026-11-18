import { LOCALE_CODES, type LocaleCode } from "../i18n";
import { getMessages } from "../i18n";

/** If the text matches a starter in any locale, return the same starter in `target`. */
export function localizeStarterContent(
  content: string,
  target: LocaleCode,
): string {
  const trimmed = content.trim();
  for (const locale of LOCALE_CODES) {
    const match = getMessages(locale).starters.find(
      (starter) => starter.fill === trimmed,
    );
    if (match) {
      const localized = getMessages(target).starters.find(
        (starter) => starter.id === match.id,
      );
      return localized?.fill ?? trimmed;
    }
  }
  return content;
}
