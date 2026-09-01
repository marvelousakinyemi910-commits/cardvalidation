/**
 * Implements the Luhn algorithm (mod 10 checksum), the standard checksum
 * used to validate identification numbers such as credit/debit card numbers.
 *
 * Reference: ISO/IEC 7812-1
 *
 * Algorithm:
 * 1. Starting from the rightmost digit, double every second digit.
 * 2. If doubling a digit results in a number > 9, subtract 9 from it
 *    (equivalent to summing its two digits).
 * 3. Sum all the digits (doubled and untouched).
 * 4. The number is valid if the total sum is divisible by 10.
 *
 * @param digits - a string containing ONLY digit characters (0-9).
 *                 Callers are responsible for sanitizing/format-validating
 *                 input before calling this function.
 */
export function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  // Iterate right to left.
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
