import { Router } from "express";
import {
  getRecipesHandler,
  getRecipeByIdHandler,
  createRecipeHandler,
  deleteRecipeHandler,
  addIngredientToRecipeHandler,
} from "./recipe.controller.ts";
import { requireApiKey } from "../auth.middleware.ts";

const router = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *   schemas:
 *     Recipe:
 *       type: object
 *       required: [id, titel, minuten, portionen, schwierigkeit]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titel:
 *           type: string
 *           example: Spaghetti Carbonara
 *         minuten:
 *           type: integer
 *           example: 20
 *         portionen:
 *           type: integer
 *           example: 2
 *         schwierigkeit:
 *           type: string
 *           example: Einfach
 *         zutaten:
 *           type: array
 *           items:
 *             type: object
 *             additionalProperties:
 *               type: array
 *               items:
 *                 type: string
 *     RecipeCreate:
 *       type: object
 *       required: [titel, minuten, portionen, schwierigkeit]
 *       properties:
 *         titel:
 *           type: string
 *           example: Spaghetti Carbonara
 *         minuten:
 *           type: integer
 *           example: 20
 *         portionen:
 *           type: integer
 *           example: 2
 *         schwierigkeit:
 *           type: string
 *           example: Einfach
 *         zutaten:
 *           type: array
 *           items:
 *             type: object
 *             additionalProperties:
 *               type: array
 *               items:
 *                 type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Rezept mit ID 99 nicht gefunden
 */

/**
 * @openapi
 * /recipes:
 *   get:
 *     tags:
 *       - Rezepte
 *     summary: Alle Rezepte als Array ausgeben
 *     responses:
 *       200:
 *         description: Gibt eine Liste aller Rezepte aus.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", getRecipesHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     tags:
 *       - Rezepte
 *     summary: Einzelnes Rezept anhand seiner ID abrufen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gibt das angeforderte Rezept aus.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Rezept mit der angegebenen ID wurde nicht gefunden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getRecipeByIdHandler);

/**
 * @openapi
 * /recipes:
 *   post:
 *     tags:
 *       - Rezepte
 *     summary: Neues Rezept erstellen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecipeCreate'
 *     responses:
 *       201:
 *         description: Rezept wurde erstellt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Ungültige Eingaben
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", createRecipeHandler);

/**
 * @openapi
 * /recipes/{id}/ingredients:
 *   post:
 *     tags:
 *       - Rezepte
 *     summary: Zutat zu einem Rezept hinzufügen
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ingredientName, amount]
 *             properties:
 *               ingredientName:
 *                 type: string
 *               amount:
 *                 type: string
 *     responses:
 *       204:
 *         description: Zutat wurde dem Rezept hinzugefügt
 *       400:
 *         description: Ungültige Rezept-/Zutaten-ID oder Menge
 */
router.post("/:id/ingredients", addIngredientToRecipeHandler);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     tags:
 *       - Rezepte
 *     summary: Rezept anhand seiner ID löschen
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Rezept wurde gelöscht
 *       401:
 *         description: API-Key fehlt oder ist ungültig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Rezept mit der angegebenen ID wurde nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", requireApiKey, deleteRecipeHandler);

export default router;