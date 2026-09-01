import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../dto/validate-card.dto";

/**
 * Handles requests to routes that don't exist.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
}

/**
 * Centralized error handler. Express identifies this as an error handler
 * by its 4-argument signature (err, req, res, next) — `next` must stay in
 * the signature even though it's unused, or Express will treat this as a
 * regular middleware instead.
 *
 * Known ValidationErrors map to 400 (client's fault — bad request shape).
 * Anything else is treated as unexpected and mapped to 500, without
 * leaking internal error details to the client.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Must stay in the signature (see comment above) even though unused;
  // prefixed with `_` so `noUnusedParameters` doesn't flag it.
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
