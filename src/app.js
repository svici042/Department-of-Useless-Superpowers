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

export default app;
