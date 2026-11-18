import type { CoachApiReply, CheckInReminder } from "../types";
import { createId } from "./history";

export function reminderFromReply(
  reply: CoachApiReply,
): CheckInReminder | null {
  if (reply.mode !== "coach") return null;
  if (reply.checkIn.type !== "time" || !reply.checkIn.dueInMinutes) {
    return null;
  }

  const dueInMinutes = reply.checkIn.dueInMinutes;

  return {
    id: createId(),
    text: reply.checkIn.text,
    language: reply.language,
    dueInMinutes,
    dueAt: Date.now() + dueInMinutes * 60_000,
    status: "pending",
  };
}

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
