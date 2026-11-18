import type { ConversationMessage, CoachRequestBody } from "../types";

export function toApiHistory(
  messages: ConversationMessage[],
): CoachRequestBody["history"] {
  return messages.map((message) => {
    if (message.role === "parent") {
      return { role: "parent" as const, content: message.content };
    }

    if (message.reply.mode === "coach") {
      return {
        role: "coach" as const,
        content: [message.reply.summary, ...message.reply.steps].join(" "),
      };
    }

    return {
      role: "coach" as const,
      content: message.reply.message,
    };
  });
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
