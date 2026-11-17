import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Department of Useless Superpowers!",
    motto: "With great power comes absolutely no responsibility.",
  });
});

export default app;
