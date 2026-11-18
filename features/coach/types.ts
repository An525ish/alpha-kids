import type { LocaleCode } from "../../shared/i18n/locales";

export type ParentRole = "parent";
export type CoachRole = "coach";

/** App + API locale. Extend via shared/i18n/locales.ts */
export type CoachLanguage = LocaleCode;

export type CheckIn = {
  type: "question" | "time";
  text: string;
  dueInMinutes?: number;
};

export type CoachReply = {
  mode: "coach";
  language: CoachLanguage;
  summary: string;
  steps: string[];
  checkIn: CheckIn;
};

export type EscalateReply = {
  mode: "escalate";
  language: CoachLanguage;
  reason: "emergency" | "abuse" | "self_harm";
  message: string;
  resources: string[];
};

export type CoachApiReply = CoachReply | EscalateReply;

export type ParentMessage = {
  id: string;
  role: ParentRole;
  content: string;
  createdAt: number;
};

export type CoachMessage = {
  id: string;
  role: CoachRole;
  reply: CoachApiReply;
  createdAt: number;
};

export type ConversationMessage = ParentMessage | CoachMessage;

export type CoachRequestBody = {
  message: string;
  history: { role: "parent" | "coach"; content: string }[];
  language?: CoachLanguage;
  instant?: boolean;
};

export type CheckInReminder = {
  id: string;
  text: string;
  language: CoachLanguage;
  dueAt: number;
  dueInMinutes: number;
  status: "pending" | "due";
};

export type ConcernStarter = {
  id: string;
  label: string;
  fill: string;
};
