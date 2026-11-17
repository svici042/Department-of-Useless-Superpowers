import heroes from "../store/heroes.store.js";

export function getAllHeroes(req, res) {
  res.status(200).json(heroes);
}
