import type { CoachRequest, CoachResponse } from "./schema";
import { buildEscalateResponse, detectCrisis } from "./safety";

type Topic = "sleep" | "tantrum" | "school" | "sibling" | "general";
type CoachPayload = Extract<CoachResponse, { mode: "coach" }>;

const URDU_SCRIPT = /[\u0600-\u06FF]/;

const TOPIC_RULES: { topic: Topic; pattern: RegExp }[] = [
  {
    topic: "sleep",
    pattern: /\b(sleep|bedtime|nap|night\s*wak|insomni|سونہ|نیند|سلیپ)\b/i,
  },
  {
    topic: "tantrum",
    pattern: /\b(tantrum|meltdown|scream|yell|hitting|غضب|چیخ|غصہ)\b/i,
  },
  {
    topic: "school",
    pattern: /\b(school|homework|morning\s*rush|bus|اسکول|ہوم\s*ورک)\b/i,
  },
  {
    topic: "sibling",
    pattern: /\b(sibling|brother|sister|fight|jealous|بھائی|بہن|لڑائی)\b/i,
  },
];

type Template = Omit<CoachPayload, "summary" | "language"> & {
  summaryEn: string;
  summaryUr: string;
};

const TEMPLATES: Record<Topic, Template> = {
  sleep: {
    mode: "coach",
    summaryEn: "Nights settle when the wind-down stays boring and the same.",
    summaryUr: "رات تب سنبھلتی ہے جب آرام کا معمول سادہ اور ایک جیسا ہو۔",
    steps: [
      "Pick one wind-down cue (same song or same light) and use only that tonight.",
      "Screens off for the last 30 minutes. Lights-out time stays fixed.",
      "If they call out, check once, keep words short, leave calmly.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 20 minutes after lights-out. How many call-outs?",
      dueInMinutes: 20,
    },
  },
  tantrum: {
    mode: "coach",
    summaryEn: "Big feelings need a smaller stage. You stay steady while it passes.",
    summaryUr: "غصے کے لمحے میں آپ پرسکون رہیں، لمبی بات بعد میں۔",
    steps: [
      "Move to a quieter spot if you can. Fewer eyes, less fuel.",
      "Name one feeling in a short sentence. No lecture mid-storm.",
      "When the body settles, offer water, a hug, or a choice of two.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 15 minutes. What calmed them first?",
      dueInMinutes: 15,
    },
  },
  school: {
    mode: "coach",
    summaryEn: "Mornings get lighter when tonight does the prep.",
    summaryUr: "صبح آسان تب بنتی ہے جب رات کو تیاری ہو۔",
    steps: [
      "Bag, clothes, and water bottle by the door before bed.",
      "Pick one morning friction and script one calm sentence for it.",
      "Add two extra minutes for that hard step so you are not rushing.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 25 minutes after you finish tonight's prep.",
      dueInMinutes: 25,
    },
  },
  sibling: {
    mode: "coach",
    summaryEn: "Sibling heat drops with one clear rule and fair turns.",
    summaryUr: "بہن بھائی کی لڑائی میں ایک اصول اور باری واضح رکھیں۔",
    steps: [
      "If bodies are unsafe, separate them for two minutes first.",
      "State one house rule in one sentence.",
      "Give each child one turn to speak while the other waits.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 20 minutes. Did the turns hold?",
      dueInMinutes: 20,
    },
  },
  general: {
    mode: "coach",
    summaryEn: "One small move you can finish today beats a long lecture.",
    summaryUr: "آج ایک چھوٹا قدم کافی ہے۔ لمبی بات بعد میں۔",
    steps: [
      "Name the outcome you want in one sentence.",
      "Choose one action under five minutes that nudges toward it.",
      "Tell your child the plan in one calm sentence, then do it.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 20 minutes and say what you tried.",
      dueInMinutes: 20,
    },
  },
};

const URDU_STEPS: Record<Topic, string[]> = {
  sleep: [
    "آج صرف ایک آرام کا اشارہ چنیں (ایک گانا یا مدھم روشنی)۔",
    "آخری تیس منٹ اسکرین بند، سونے کا وقت طے شدہ۔",
    "اگر بلایا جائے تو مختصر جواب دیں، پرسکون رہیں، کمرے سے باہر آ جائیں۔",
  ],
  tantrum: [
    "ممکن ہو تو پرسکون جگہ پر لے جائیں۔",
    "ایک مختصر جملے میں جذبہ نامزد کریں۔ لمبی نصیحت اب نہیں۔",
    "جب سکون آئے تو پانی، گلے، یا دو آسان اختیار دیں۔",
  ],
  school: [
    "رات کو بیگ، کپڑے اور پانی دروازے کے پاس رکھیں۔",
    "صبح کی ایک مشکل چیز کے لیے ایک پرسکون جملہ طے کریں۔",
    "اس قدم کے لیے دو اضافی منٹ رکھیں تاکہ جلدی میں بحث نہ ہو۔",
  ],
  sibling: [
    "اگر مار پیٹ ہو تو دو منٹ الگ کریں۔ حفاظت پہلے۔",
    "ایک گھر کا اصول ایک جملے میں کہیں۔",
    "ہر بچے کو ایک باری بولنے دیں، دوسرا انتظار کرے۔",
  ],
  general: [
    "اپنی فکر ایک جملے میں لکھیں: کیا ہوا، اور آپ کیا چاہتے ہیں۔",
    "پانچ منٹ سے کم کا ایک عملی قدم چنیں۔",
    "عمل سے پہلے بچے کو ایک پرسکون جملے میں منصوبہ بتائیں۔",
  ],
};

const URDU_CHECKINS: Record<Topic, CoachPayload["checkIn"]> = {
  sleep: {
    type: "time",
    text: "بیس منٹ بعد واپس آئیں: کتنی بار بلایا؟",
    dueInMinutes: 20,
  },
  tantrum: {
    type: "time",
    text: "پندرہ منٹ بعد بتائیں کیا سکون لایا۔",
    dueInMinutes: 15,
  },
  school: {
    type: "time",
    text: "پچیس منٹ بعد تیاری کے بعد بتائیں کیا بچا۔",
    dueInMinutes: 25,
  },
  sibling: {
    type: "time",
    text: "بیس منٹ بعد بتائیں باری چلی یا نہیں۔",
    dueInMinutes: 20,
  },
  general: {
    type: "time",
    text: "بیس منٹ بعد بتائیں آپ نے کیا آزمایا۔",
    dueInMinutes: 20,
  },
};

export function detectLanguage(message: string): "en" | "ur" {
  return URDU_SCRIPT.test(message) ? "ur" : "en";
}

export function detectTopic(message: string): Topic {
  for (const rule of TOPIC_RULES) {
    if (rule.pattern.test(message)) return rule.topic;
  }
  return "general";
}

function concernSnippet(message: string): string {
  const cleaned = message.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 52) return cleaned;
  return `${cleaned.slice(0, 49).trimEnd()}…`;
}

function withEcho(
  language: "en" | "ur",
  message: string,
  baseSummary: string,
): string {
  const snippet = concernSnippet(message);
  const combined =
    language === "ur"
      ? `آپ نے لکھا: «${snippet}». ${baseSummary}`
      : `You wrote: “${snippet}”. ${baseSummary}`;
  if (combined.length <= 400) return combined;
  return `${combined.slice(0, 397).trimEnd()}…`;
}

export function buildMockCoachReply(input: CoachRequest): CoachResponse {
  const language = detectLanguage(input.message);
  const crisis = detectCrisis(input.message);
  if (crisis) {
    return buildEscalateResponse(crisis.reason, language);
  }

  const topic = detectTopic(input.message);
  const template = TEMPLATES[topic];

  if (language === "ur") {
    return {
      mode: "coach",
      language: "ur",
      summary: withEcho("ur", input.message, template.summaryUr),
      steps: URDU_STEPS[topic],
      checkIn: URDU_CHECKINS[topic],
    };
  }

  return {
    mode: "coach",
    language: "en",
    summary: withEcho("en", input.message, template.summaryEn),
    steps: template.steps,
    checkIn: template.checkIn,
  };
}
