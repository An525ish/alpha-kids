import type { LocaleCode } from "../../../shared/i18n/locales";

export type ConcernStarterMessage = {
  id: string;
  label: string;
  fill: string;
};

export type CoachMessages = {
  brand: string;
  kicker: string;
  ledeFull: string;
  ledeShort: string;
  boardLabel: string;
  boardClear: string;
  boardAria: string;
  emptyTitle: string;
  emptyBody: string;
  peekEmpty: string;
  peekThread: string;
  peekAria: string;
  composerLabel: string;
  composerPlaceholder: string;
  composerSubmit: string;
  composerTrust: string;
  composerCollapse: string;
  startersAria: string;
  waiting: string;
  youTag: string;
  languageToggleAria: string;
  languageToggleLabel: string;
  reachError: string;
  timerNow: string;
  timerDue: string;
  timerLabel: string;
  timerWriteUpdate: string;
  timerDismissAria: string;
  confirmTitle: string;
  confirmBody: string;
  confirmKeep: string;
  confirmDismiss: string;
  clearConfirmTitle: string;
  clearConfirmBody: string;
  clearConfirmKeep: string;
  clearConfirmClear: string;
  escalateEyebrow: string;
  planTag: string;
  checkInTimer: string;
  checkInQuestion: string;
  checkInTimerMeta: string;
  checkInQuestionMeta: string;
  starters: ConcernStarterMessage[];
};

export type MessageKey = {
  [K in keyof CoachMessages]: CoachMessages[K] extends string ? K : never;
}[keyof CoachMessages];

export type CoachCatalog = Record<LocaleCode, CoachMessages>;
