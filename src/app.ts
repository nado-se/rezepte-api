import express from "express";
import recipeRoutes from "./recipes/recipe.routes";

const app = express();
app.use(express.json());              // JSON im Request-Body lesen

app.get("/", (req, res) => {
  res.send("Willkommen bei der Rezepte-API 👋");
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/recipes", recipeRoutes);    // alle Rezept-Routen hängen unter /recipes

export default app;                   // die fertige App exportieren (NICHT starten)