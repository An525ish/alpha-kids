"use client";

import {
  getLocaleMeta,
  getMessages,
  isRtlLocale,
  type LocaleCode,
} from "../i18n";
import { useConversationStore } from "../stores/conversation";

/** Active UI locale from the session store + helpers. */
export function useLocale() {
  const language = useConversationStore((s) => s.language);
  const setLanguage = useConversationStore((s) => s.setLanguage);
  const messages = getMessages(language);
  const meta = getLocaleMeta(language);

  return {
    language,
    setLanguage,
    messages,
    meta,
    dir: meta.dir,
    isRtl: isRtlLocale(language),
  };
}

/** Messages for a specific locale (e.g. a coach reply's language). */
export function useMessages(locale: LocaleCode) {
  return getMessages(locale);
}
