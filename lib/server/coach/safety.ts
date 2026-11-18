import type { CoachResponse } from "./schema";

type CrisisReason = Extract<CoachResponse, { mode: "escalate" }>["reason"];

type CrisisHit = {
  reason: CrisisReason;
};

const SELF_HARM_EN =
  /\b(kill\s*(my|him|her|them)?\s*self|suicide|want\s*to\s*die|end\s*(it|my\s*life)|self[-\s]?harm|hurt\s*myself)\b/i;

const ABUSE_EN =
  /\b(sexually?\s*abus|molest|beating\s*(my|the)\s*(child|kid|son|daughter)|hitting\s*(my|the)\s*(child|kid)|child\s*abuse|domestic\s*violence)\b/i;

const EMERGENCY_EN =
  /\b(overdose|not\s*breathing|unconscious|choking|seizure|bleeding\s*(a\s*lot|heavily)|call\s*911|ambulance|emergency\s*room)\b/i;

const SELF_HARM_UR =
  /(خودکشی|خود\s*کشی|مرنا\s*چاہتا|جان\s*دینا|اپنے\s*آپ\s*کو\s*نقصان)/;

const ABUSE_UR = /(بچے\s*کو\s*مار|جنسی\s*زیادتی|زیادتی|تشدد|اذیت)/;

const EMERGENCY_UR = /(ایمبولینس|ہنگامی|سانس\s*نہیں|بے\s*ہوش|خون\s*بہہ)/;

export function detectCrisis(message: string): CrisisHit | null {
  const text = message.trim();
  if (!text) return null;

  if (SELF_HARM_EN.test(text) || SELF_HARM_UR.test(text)) {
    return { reason: "self_harm" };
  }
  if (ABUSE_EN.test(text) || ABUSE_UR.test(text)) {
    return { reason: "abuse" };
  }
  if (EMERGENCY_EN.test(text) || EMERGENCY_UR.test(text)) {
    return { reason: "emergency" };
  }
  return null;
}

export function buildEscalateResponse(
  reason: CrisisReason,
  language: "en" | "ur",
): Extract<CoachResponse, { mode: "escalate" }> {
  if (language === "ur") {
    return {
      mode: "escalate",
      language: "ur",
      reason,
      message:
        "یہ صورتحال کوچنگ سے باہر ہے۔ ابھی مقامی ایمرجنسی سروسز یا کسی قابلِ اعتماد مددگار سے رابطہ کریں۔",
      resources: [
        "فوری خطرے پر مقامی ایمرجنسی نمبر پر کال کریں۔",
        "قریب کے کسی قابلِ اعتماد شخص کو بتائیں۔",
        "Alpha Kids طبی یا قانونی مشورہ نہیں دیتا۔",
      ],
    };
  }

  return {
    mode: "escalate",
    language: "en",
    reason,
    message:
      "This is outside coaching. Contact local emergency services or a trusted person who can help right now.",
    resources: [
      "If anyone is in immediate danger, call your local emergency number.",
      "Tell a trusted adult or professional nearby.",
      "Alpha Kids does not give medical or legal advice.",
    ],
  };
}
