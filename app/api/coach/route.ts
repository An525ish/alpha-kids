import { getCoachReply } from "@/lib/server/coach/service";
import { AppError, errorResponse } from "@/lib/server/errors";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new AppError("Send a JSON body.", 400, "INVALID_JSON");
    }

    const result = await getCoachReply(body);
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
