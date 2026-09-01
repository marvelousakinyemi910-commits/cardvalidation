/**
 * Thrown when the incoming request body doesn't meet the shape we require.
 * Kept distinct from "the card number is invalid" — that's a legitimate
 * *result* (200, valid: false), whereas this represents a malformed
 * *request* (400).
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// ISO/IEC 7812-1 allows PAN lengths up to 19 digits; most real networks
// use 13-19. We accept 8 as a practical lower bound to avoid rejecting
// legitimate shorter formats (e.g. some legacy/regional cards) while still
// catching obvious garbage.
const MIN_LENGTH = 8;
const MAX_LENGTH = 19;

/**
 * Validates and normalizes the raw request body into a clean digit-only
 * string ready for the validation service.
 *
 * Accepts spaces and dashes as separators (common in how people type card
 * numbers) but rejects anything else non-numeric.
 *
 * @throws {ValidationError} if the input is missing or malformed.
 */
export function parseCardNumberInput(body: unknown): string {
  if (typeof body !== "object" || body === null || !("cardNumber" in body)) {
    throw new ValidationError("Request body must include a 'cardNumber' field");
  }

  const { cardNumber } = body as Record<string, unknown>;

  if (typeof cardNumber !== "string") {
    throw new ValidationError("'cardNumber' must be a string");
  }

  const sanitized = cardNumber.replace(/[\s-]/g, "");

  if (sanitized.length === 0) {
    throw new ValidationError("'cardNumber' must not be empty");
  }

  if (!/^\d+$/.test(sanitized)) {
    throw new ValidationError("'cardNumber' must contain only digits, spaces, or dashes");
  }

  if (sanitized.length < MIN_LENGTH || sanitized.length > MAX_LENGTH) {
    throw new ValidationError(
      `'cardNumber' must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits long`
    );
  }

  return sanitized;
}
