import { isValidLuhn } from "../validators/luhn";

export type CardType = "Visa" | "Mastercard" | "American Express" | "Discover" | null;

export interface CardValidationResult {
  valid: boolean;
  cardType: CardType;
}

/**
 * Detects the card brand from its digit prefix and length.
 * Rules are simplified (real-world ranges are more granular) but cover
 * the common test-card prefixes for each major network.
 */
function detectCardType(digits: string): CardType {
  if (/^4\d{12,18}$/.test(digits)) return "Visa";
  if (/^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/.test(digits)) {
    return "Mastercard";
  }
  if (/^3[47]\d{13}$/.test(digits)) return "American Express";
  if (/^6(?:011|5\d{2})\d{12}$/.test(digits)) return "Discover";

  return null;
}

/**
 * Validates a sanitized card number (digits only, correct length already
 * confirmed by the caller) using the Luhn checksum, and attempts to
 * identify its brand.
 *
 * This service assumes the input has already passed request-level
 * validation (see validate-card.dto.ts) — it focuses purely on the
 * business logic of "is this a valid card number".
 */
export function validateCardNumber(digits: string): CardValidationResult {
  const valid = isValidLuhn(digits);

  return {
    valid,
    // Only report a brand for numbers that actually pass the checksum;
    // an invalid number's "brand" isn't meaningful.
    cardType: valid ? detectCardType(digits) : null,
  };
}
