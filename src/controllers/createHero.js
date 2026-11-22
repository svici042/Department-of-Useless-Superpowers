import heroes from "../store/heroes.store.js";

export function createHero(req, res) {
  const data = req.body;

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({ error: "Hero data must be an object" });
  }

  // Reject text fields that are empty after trimming.
  const textFields = ["name", "power", "limitation"];

  for (const field of textFields) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      return res.status(400).json({ error: `Invalid ${field}` });
    }
  }

  if (
    !Number.isInteger(data.usefulness) ||
    data.usefulness < 0 ||
    data.usefulness > 10
  ) {
    return res.status(400).json({ error: "Usefulness must be an integer from 0 to 10" });
  }

  // Heroes are only appended, so the last hero has the highest ID.
  const nextId = (heroes.at(-1)?.id ?? 0) + 1;
  const hero = {
    id: nextId,
    name: data.name.trim(),
    power: data.power.trim(),
    limitation: data.limitation.trim(),
    usefulness: data.usefulness,
    status: "Approved",
  };

  heroes.push(hero);
  return res.status(201).json(hero);
}
