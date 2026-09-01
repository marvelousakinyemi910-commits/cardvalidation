import { Request, Response, NextFunction } from "express";
import { parseCardNumberInput } from "../dto/validate-card.dto";
import { validateCardNumber } from "../services/card-validation.service";

/**
 * POST /api/v1/card/validate
 *
 * Deliberate status code split:
 * - 400: the REQUEST itself is malformed (missing/wrong-type/wrong-shape
 *   cardNumber). The caller needs to fix how they're calling the API.
 * - 200: the request was well-formed and we were able to answer the
 *   question asked, even if that answer is "no, this card is invalid".
 *   `{ valid: false }` is a correct, successful response — not an error.
 *
 * Parsing/validation errors are forwarded to the centralized error
 * handler via `next(err)` rather than handled inline here, so this
 * controller stays focused on orchestration.
 */
export function validateCard(req: Request, res: Response, next: NextFunction): void {
  try {
    const sanitizedDigits = parseCardNumberInput(req.body);
    const result = validateCardNumber(sanitizedDigits);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
