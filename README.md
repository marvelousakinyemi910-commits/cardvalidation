# Card Validator API

A small Express + TypeScript API that determines whether a card number is
structurally valid, using the Luhn checksum algorithm.

## Getting Started

```bash
npm install
npm run dev      # starts the dev server with auto-reload on http://localhost:3000
```

Other scripts:

```bash
npm run build    # compiles TypeScript to dist/
npm start        # runs the compiled build
npm test         # runs the unit and integration test suite (Jest)
```

## The Endpoint

### `POST /api/v1/card/validate`

**Request body:**

```json
{ "cardNumber": "4111 1111 1111 1111" }
```

`cardNumber` may contain spaces or dashes as separators (e.g. `"4111-1111-1111-1111"`);
these are stripped before validation.

**Successful responses (200):**

```json
{ "valid": true, "cardType": "Visa" }
```

```json
{ "valid": false, "cardType": null }
```

**Bad request (400)** — the request itself is malformed:

```json
{ "error": "'cardNumber' must contain only digits, spaces, or dashes" }
```

**Not found (404)** — unknown route.

## Design Decisions

**Why 200 for an invalid card number, but 400 for bad input?**
These represent two different failure modes. A card number that is
well-formed (right shape, digits only, sensible length) but fails the
Luhn checksum is a *legitimate answer* to the question "is this valid?" —
the API did its job correctly and the answer is "no". That's a 200. A
request that's missing `cardNumber`, sends the wrong type, or contains
garbage characters is a problem with *how the API was called*, which is
what 400 is for. Conflating the two would make client error handling
confusing — a client shouldn't have to catch an HTTP error just to learn
a card number is invalid.

**Why Express instead of NestJS?**
For a single endpoint, NestJS's module/controller/DI machinery adds
structure the project doesn't need yet. A plain layered structure
(route → controller → service → validator) gives the same separation of
concerns with less to explain and less incidental complexity.

**Why is the Luhn algorithm a standalone pure function?**
`src/validators/luhn.ts` takes a sanitized digit string and returns a
boolean — no knowledge of HTTP, Express, or input formats. It's the one
piece of logic with an objectively correct answer, so it's kept isolated
and trivially unit-testable on its own.

**Why separate "parsing/sanitizing input" from "validating the card"?**
`src/dto/validate-card.dto.ts` is responsible for turning an arbitrary
request body into a clean digit string (or throwing a `ValidationError`).
`src/services/card-validation.service.ts` only ever receives already-clean
input and focuses purely on the Luhn check and brand detection. This
keeps "is the request shaped correctly" and "is the card number valid"
as two independently testable concerns.

**Card length bounds:** accepts 8–19 digits, based on the ISO/IEC 7812-1
range for Primary Account Numbers (most real-world cards are 13–19
digits; 8 is a permissive lower bound rather than a strict standard).

**Card brand detection** is a bonus on top of the core requirement — it's
only reported when the number passes the Luhn check, since a brand label
on an invalid number isn't meaningful.

## Project Structure

```
src/
  app.ts                          # Express app construction (no listen())
  server.ts                       # Entry point — starts the HTTP server
  routes/card.routes.ts           # Route definitions
  controllers/card.controller.ts  # Request/response orchestration
  dto/validate-card.dto.ts        # Input parsing, sanitizing, and shape validation
  services/card-validation.service.ts  # Luhn check + brand detection
  validators/luhn.ts              # Pure Luhn algorithm implementation
  middleware/error-handler.ts     # Centralized error + 404 handling
tests/
  luhn.test.ts                    # Unit tests for the algorithm
  card.controller.test.ts         # Integration tests through the real Express app
```

`app.ts` and `server.ts` are split deliberately so tests can import
`createApp()` and exercise the full middleware stack via `supertest`
without binding a real network port.
