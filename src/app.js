import express from "express";
import heroRoutes from "./routes/heroRoutes.js";

const app = express();

app.use(express.json());
app.use("/heroes", heroRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Department of Useless Superpowers!",
    motto: "With great power comes absolutely no responsibility.",
  });
});

// Return a short JSON error when Express cannot parse a request body.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  return next(error);
});

export default app;
