import express, { Express } from "express";
import { cardRouter } from "./routes/card.routes";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

/**
 * Builds and configures the Express application. Kept separate from
 * server.ts (which actually starts listening) so the app can be imported
 * directly into tests via supertest without binding a real port.
 */
export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use("/api/v1/card", cardRouter);

  // Order matters: 404 handler catches anything not matched above,
  // and the error handler must be registered last so Express recognizes
  // it (by its 4-argument signature) as the error-handling middleware.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
