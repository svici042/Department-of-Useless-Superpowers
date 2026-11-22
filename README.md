# Department of Useless Superpowers

A small API that keeps track of heroes with powers like invisibility that only works when nobody is looking. It uses Node.js, Express, and JavaScript ES modules.

```sh
npm install
npm start
```

The server runs at `http://localhost:3000`. Use `npm run dev` to restart it automatically when you edit the source.

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/` | Shows the department's welcome message |
| GET | `/heroes` | Lists all heroes |
| GET | `/heroes/:id` | Looks up a hero by ID |
| POST | `/heroes` | Creates an approved hero and assigns an ID |

Example JSON body for `POST /heroes` (use `Content-Type: application/json`):

```json
{
  "name": "Reaper",
  "power": "Can stop hair growth for 3 seconds",
  "limitation": "He is bald.",
  "usefulness": 0
}
```

Start the server, open the `bruno` folder as a collection in Bruno, and send the saved requests or run the full collection. Use `npm test` to run the automated HTTP tests.

Heroes are stored in memory. Restarting the server clears added heroes and restores the original five.
