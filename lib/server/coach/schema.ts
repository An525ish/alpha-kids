import { z } from "zod";

export const historyMessageSchema = z.object({
  role: z.enum(["parent", "coach"]),
  content: z.string().min(1).max(2000),
});

export const coachRequestSchema = z.object({
  message: z.string().trim().min(1, "Type a concern first.").max(2000),
  history: z.array(historyMessageSchema).max(20).default([]),
});

export const checkInSchema = z.object({
  type: z.enum(["question", "time"]),
  text: z.string().min(1).max(280),
  dueInMinutes: z.number().int().positive().max(24 * 60).optional(),
});

export const coachPayloadSchema = z.object({
  mode: z.literal("coach"),
  language: z.enum(["en", "ur"]),
  summary: z.string().min(1).max(400),
  steps: z.array(z.string().min(1).max(200)).min(1).max(5),
  checkIn: checkInSchema,
});

export const escalatePayloadSchema = z.object({
  mode: z.literal("escalate"),
  language: z.enum(["en", "ur"]),
  reason: z.enum(["emergency", "abuse", "self_harm"]),
  message: z.string().min(1).max(600),
  resources: z.array(z.string().min(1).max(200)).min(1).max(5),
});

export const coachResponseSchema = z.discriminatedUnion("mode", [
  coachPayloadSchema,
  escalatePayloadSchema,
]);

export type CoachRequest = z.infer<typeof coachRequestSchema>;
export type CoachResponse = z.infer<typeof coachResponseSchema>;
export type HistoryMessage = z.infer<typeof historyMessageSchema>;
