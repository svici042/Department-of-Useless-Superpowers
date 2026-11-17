import { Router } from "express";
import { getAllHeroes } from "../controllers/getAllHeroes.js";
import { getHeroById } from "../controllers/getHeroById.js";

const heroRoutes = Router();

heroRoutes.get("/", getAllHeroes);
heroRoutes.get("/:id", getHeroById);

export default heroRoutes;
