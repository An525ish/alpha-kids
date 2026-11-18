export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(
      { error: { message: error.message, code: error.code } },
      { status: error.status },
    );
  }

  if (error && typeof error === "object" && "name" in error) {
    const name = (error as { name?: string }).name;
    if (name === "ZodError") {
      return Response.json(
        { error: { message: "Check your message and try again.", code: "VALIDATION" } },
        { status: 400 },
      );
    }
  }

  return Response.json(
    { error: { message: "Something went wrong. Try again.", code: "INTERNAL" } },
    { status: 500 },
  );
}
