type PayPalApiError = {
  message?: unknown;
  statusCode?: unknown;
  result?: unknown;
};

/**
 * Reads the human-readable message from a parsed PayPal response body.
 *
 * - Orders API errors: `{ name, message, debug_id }`
 * - OAuth token errors: `{ error, error_description }`
 */
function messageFromResult(result: unknown): string | undefined {
  if (typeof result !== "object" || result === null) {
    return undefined;
  }

  const r = result as Record<string, unknown>;
  const candidate = r.message ?? r.error_description ?? r.error ?? r.name;

  return candidate !== undefined &&
    candidate !== null &&
    candidate !== ""
    ? String(candidate)
    : undefined;
}

/**
 * Extracts a usable message from a PayPal server SDK error.
 *
 * The SDK (@apimatic/core) throws `ApiError` subclasses whose `.message`
 * is empty — the real error lives in the parsed `.result` body. Prefer
 * that, then fall back to `.message`, then to the stringified error.
 */
export function getPayPalErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const e = error as PayPalApiError;
    const fromResult = messageFromResult(e.result);

    if (fromResult) {
      return e.statusCode ? `${fromResult} (HTTP ${e.statusCode})` : fromResult;
    }

    if (typeof e.message === "string" && e.message !== "") {
      return e.statusCode ? `${e.message} (HTTP ${e.statusCode})` : e.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return String(error);
}
