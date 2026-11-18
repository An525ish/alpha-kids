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
    summaryEn: "Bedtime usually softens when tonight looks like last night.",
    summaryUr: "سونے کا وقت آسان ہوتا ہے جب آج رات کل جیسی سادہ ہو۔",
    steps: [
      "Pick one boring wind-down for tonight, same song or same lamp, nothing new.",
      "Screens off about 30 minutes before bed. Keep lights-out at the same time.",
      "If they call out, go in once, say something short, then leave.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 20 minutes after lights-out. How many times did they call you?",
      dueInMinutes: 20,
    },
  },
  tantrum: {
    mode: "coach",
    summaryEn: "When they're flooded, keep it small. You don't need a speech right now.",
    summaryUr: "جب بچہ غصے میں ہو، بات چھوٹی رکھیں۔ لمبی بات بعد میں۔",
    steps: [
      "Move somewhere quieter if you can. Less of an audience helps.",
      "Name one feeling in a short line. Save the big talk for later.",
      "When they settle, offer water, a hug, or two simple choices.",
    ],
    checkIn: {
      type: "question",
      text: "What helped first after it passed: your voice, some space, or water?",
    },
  },
  school: {
    mode: "coach",
    summaryEn: "Mornings get less crazy if you handle the fiddly stuff tonight.",
    summaryUr: "صبح ہلکی پڑتی ہے جب رات کو چھوٹی تیاری ہو جائے۔",
    steps: [
      "Bag, clothes, and water bottle by the door before bed.",
      "Think of the morning fight that always starts it, and pick one calm line you'll say.",
      "Give that hard step two extra minutes so you're not rushing and yelling.",
    ],
    checkIn: {
      type: "time",
      text: "Come back in 25 minutes after tonight's prep. What still feels messy?",
      dueInMinutes: 25,
    },
  },
  sibling: {
    mode: "coach",
    summaryEn: "When they go at each other, one clear rule beats a long lecture.",
    summaryUr: "لڑائی میں ایک واضح اصول لمبی نصیحت سے بہتر ہے۔",
    steps: [
      "If someone might get hurt, separate them for a couple of minutes first.",
      "Say one house rule in one short sentence.",
      "Let each kid talk for a turn while the other waits.",
    ],
    checkIn: {
      type: "question",
      text: "Did the turns stick, or did it tip back into fighting?",
    },
  },
  general: {
    mode: "coach",
    summaryEn: "You don't need a big talk. One small thing you can do today is enough.",
    summaryUr: "بڑی تقریر کی ضرورت نہیں۔ آج ایک چھوٹا سا کام کافی ہے۔",
    steps: [
      "Say out loud what you want to change, in one plain sentence.",
      "Pick one thing under five minutes that moves you that way.",
      "Tell your kid the plan in one calm line, then do it.",
    ],
    checkIn: {
      type: "question",
      text: "What's the small thing you're going to try first?",
    },
  },
};

const URDU_STEPS: Record<Topic, string[]> = {
  sleep: [
    "آج رات صرف ایک سادہ معمول رکھیں، ایک گانا یا ایک لائٹ، کچھ نیا نہیں۔",
    "سونے سے تقریباً تیس منٹ پہلے اسکرین بند۔ وقت ایک جیسا رکھیں۔",
    "اگر بلائے تو ایک بار جائیں، مختصر بات کریں، پھر باہر آ جائیں۔",
  ],
  tantrum: [
    "ہو سکے تو تھوڑی پرسکون جگہ پر لے جائیں۔ کم لوگ، کم شور۔",
    "ایک مختصر جملے میں جذبہ کہہ دیں۔ لمبی بات بعد میں۔",
    "جب سکون آئے تو پانی، گلے، یا دو آسان اختیار دیں۔",
  ],
  school: [
    "رات کو بیگ، کپڑے اور پانی دروازے کے پاس رکھ دیں۔",
    "صبح والی وہ لڑائی سوچیں جو ہمیشہ شروع کرتی ہے، اور ایک پرسکون جملہ طے کر لیں۔",
    "اس مشکل قدم کے لیے دو منٹ زیادہ رکھیں تاکہ دوڑتے ہوئے چیخ نہ پڑے۔",
  ],
  sibling: [
    "اگر چوٹ لگ سکتی ہو تو پہلے دو منٹ الگ کر دیں۔",
    "گھر کا ایک اصول ایک چھوٹے جملے میں کہیں۔",
    "ہر بچے کو ایک باری بولنے دیں، دوسرا انتظار کرے۔",
  ],
  general: [
    "جو بدلنا چاہتے ہیں وہ ایک سادہ جملے میں کہہ لیں۔",
    "پانچ منٹ سے کم کا ایک چھوٹا کام چنیں۔",
    "بچے کو ایک پرسکون جملے میں بتائیں، پھر وہی کریں۔",
  ],
};

const URDU_CHECKINS: Record<Topic, CoachPayload["checkIn"]> = {
  sleep: {
    type: "time",
    text: "بیس منٹ بعد بتائیں: کتنی بار بلایا؟",
    dueInMinutes: 20,
  },
  tantrum: {
    type: "question",
    text: "غصے کے بعد کیا پہلے کام آیا: آپ کی آواز، تھوڑی جگہ، یا پانی؟",
  },
  school: {
    type: "time",
    text: "پچیس منٹ بعد تیاری کے بعد بتائیں: اب کیا الجھا ہوا لگتا ہے؟",
    dueInMinutes: 25,
  },
  sibling: {
    type: "question",
    text: "کیا باری چلی، یا پھر لڑائی شروع ہو گئی؟",
  },
  general: {
    type: "question",
    text: "پہلے کون سا چھوٹا کام آزمائیں گے؟",
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
      ? `سمجھا: «${snippet}». ${baseSummary}`
      : `Got it: “${snippet}”. ${baseSummary}`;
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
