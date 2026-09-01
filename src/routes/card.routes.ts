import { Router } from "express";
import { validateCard } from "../controllers/card.controller";

export const cardRouter = Router();

cardRouter.post("/validate", validateCard);
