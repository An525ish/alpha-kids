import { AppError } from "../errors";
import { buildMockCoachReply } from "./mock";
import {
  coachRequestSchema,
  coachResponseSchema,
  type CoachRequest,
  type CoachResponse,
} from "./schema";

const MOCK_DELAY_MS = 550;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getCoachReply(
  raw: unknown,
): Promise<CoachResponse> {
  const parsed = coachRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid request.";
    throw new AppError(first, 400, "VALIDATION");
  }

  const input: CoachRequest = parsed.data;
  await wait(MOCK_DELAY_MS);

  const reply = buildMockCoachReply(input);
  const checked = coachResponseSchema.safeParse(reply);
  if (!checked.success) {
    throw new AppError("Coach reply failed validation.", 500, "MOCK_INVALID");
  }

  return checked.data;
}
