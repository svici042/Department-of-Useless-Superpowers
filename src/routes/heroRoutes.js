import { Router } from "express";
import { createHero } from "../controllers/createHero.js";
import { getAllHeroes } from "../controllers/getAllHeroes.js";
import { getHeroById } from "../controllers/getHeroById.js";

const heroRoutes = Router();

heroRoutes.get("/", getAllHeroes);
heroRoutes.get("/:id", getHeroById);
heroRoutes.post("/", createHero);

export default heroRoutes;
