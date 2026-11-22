import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import app from "../src/app.js";

const originalNames = [
  "Invisible Bob",
  "Captain Obvious",
  "The Human Calculator",
  "Aqua Whisperer",
  "Time Freezer",
];
const validHero = {
  name: "  Reaper  ",
  power: "  Can stop hair growth for 3 seconds  ",
  limitation: "  He is bald.  ",
  usefulness: 0,
};

let server;
let baseUrl;

before(async () => {
  // Use a fresh server on a free port so tests leave port 3000 and its data alone.
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

async function request(path, status, options) {
  const response = await fetch(baseUrl + path, options);
  assert.equal(response.status, status, path);
  assert.match(response.headers.get("content-type"), /^application\/json\b/);
  return response.json();
}

function post(body, status) {
  return request("/heroes", status, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

test("the welcome message and all five original heroes are available", async () => {
  const welcome = await request("/", 200);
  assert.equal(welcome.message, "Welcome to the Department of Useless Superpowers!");
  assert.equal(welcome.motto, "With great power comes absolutely no responsibility.");

  const heroes = await request("/heroes", 200);
  assert.deepEqual(heroes.map((hero) => hero.name), originalNames);
  assert.deepEqual(heroes.map((hero) => hero.id), [1, 2, 3, 4, 5]);
  assert.deepEqual(await request("/heroes/1", 200), heroes[0]);
});

test("unknown IDs return 404 and invalid IDs return 400", async () => {
  assert.deepEqual(await request("/heroes/999", 404), { error: "Hero not found" });
  for (const id of ["abc", "1.5", "0", "-1", "9007199254740992"]) {
    assert.deepEqual(await request(`/heroes/${id}`, 400), { error: "Invalid hero ID" });
  }
});

test("creation trims text and assigns unique IDs and Approved status", async () => {
  const first = await post(JSON.stringify({
    ...validHero,
    id: 1,
    status: "Rejected",
  }), 201);
  assert.deepEqual(first, {
    id: 6,
    name: "Reaper",
    power: "Can stop hair growth for 3 seconds",
    limitation: "He is bald.",
    usefulness: 0,
    status: "Approved",
  });

  const second = await post(JSON.stringify({ ...validHero, usefulness: 10 }), 201);
  assert.equal(second.id, 7);
  assert.equal(second.usefulness, 10);
  assert.deepEqual(await request(`/heroes/${first.id}`, 200), first);
  assert.deepEqual(await request(`/heroes/${second.id}`, 200), second);

  const heroes = await request("/heroes", 200);
  assert.deepEqual(heroes.slice(-2), [first, second]);
});

test("invalid and malformed bodies return 400 without changing the store", async () => {
  const before = await request("/heroes", 200);
  const invalidBodies = [
    null,
    [],
    {},
    { ...validHero, name: "   " },
    { ...validHero, power: 42 },
    { ...validHero, limitation: undefined },
    { ...validHero, usefulness: undefined },
    { ...validHero, usefulness: "5" },
    { ...validHero, usefulness: 1.5 },
    { ...validHero, usefulness: -1 },
    { ...validHero, usefulness: 11 },
  ];

  for (const body of invalidBodies) {
    const result = await post(JSON.stringify(body), 400);
    assert.equal(typeof result.error, "string");
  }

  await post("", 400);
  assert.deepEqual(await post('{"name":', 400), { error: "Invalid JSON body" });
  assert.deepEqual(await request("/heroes", 200), before);
});
