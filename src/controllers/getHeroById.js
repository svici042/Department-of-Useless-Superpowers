import heroes from "../store/heroes.store.js";

export function getHeroById(req, res) {
  const { id } = req.params;

  // Check the full string before conversion so values like "1.5" cannot become valid IDs.
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return res.status(400).json({ error: "Invalid hero ID" });
  }

  const hero = heroes.find((item) => item.id === Number(id));

  if (!hero) {
    return res.status(404).json({ error: "Hero not found" });
  }

  return res.status(200).json(hero);
}
