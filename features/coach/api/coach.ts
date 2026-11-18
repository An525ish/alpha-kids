import type { CoachApiReply, CoachRequestBody } from "../types";

type ErrorBody = {
  error?: { message?: string; code?: string };
};

export async function postCoachMessage(
  body: CoachRequestBody,
): Promise<CoachApiReply> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? (data as ErrorBody).error?.message
        : undefined;
    throw new Error(message ?? "Could not reach the coach. Try again.");
  }

  return data as CoachApiReply;
}
