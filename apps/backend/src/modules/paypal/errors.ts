export function getPayPalErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const maybeResult = "result" in error ? error.result : undefined;

    if (
      typeof maybeResult === "object" &&
      maybeResult !== null &&
      "message" in maybeResult
    ) {
      return String(maybeResult.message);
    }
  }

  return String(error);
}
