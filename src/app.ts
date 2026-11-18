import express from "express";
import recipeRoutes from "./recipes/recipe.routes";
import { logger } from "./logger.middleware";
import { errorHandler } from "./error.middleware";

const app = express();
app.use(express.json());              // JSON im Request-Body lesen
app.use(logger);                      // vor den Routen -> sieht jede Anfrage

app.get("/", (req, res) => {
  res.send("Willkommen bei der Rezepte-API 👋");
});
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/crash", (req, res) => {
  throw new Error("Absichtlicher Absturz zum Testen");
});

app.use("/recipes", recipeRoutes);      // alle Rezept-Routen hängen unter /recipes
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} existiert nicht.`})
})

app.use(errorHandler);                  // muss NACH den Routen stehen

export default app;                     // die fertige App exportieren (NICHT starten)