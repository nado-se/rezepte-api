import express from "express";
import recipeRoutes from "./recipes/recipe.router.ts";
import { logger } from "./logger.middleware.ts";
import { errorHandler } from "./error.middleware.ts";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"

import { getPostgresPool } from "./pool.postgres";

//test
const pool = getPostgresPool();
const res = await pool.query("SELECT NOW()");
console.log("DB sagt:", res.rows[0]);

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: { 
          title: "Rezepte-Api", 
          version: "1.0.0",
          description: "Automatisch erstellte Dokumentation"
        },
    },
    apis: [`${import.meta.dirname}/**/*.router.ts`]
})

const app = express();

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14";
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCssUrl: `${CDN}/swagger-ui.min.css`,
    customJs: [
        `${CDN}/swagger-ui-bundle.min.js`,
        `${CDN}/swagger-ui-standalone-preset.min.js`,
    ],
}));


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