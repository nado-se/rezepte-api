import { Router } from "express";
import { getRecipesHandler, getRecipeByIdHandler, createRecipeHandler, deleteRecipeHandler } from "./recipe.controller";
import { requireApiKey } from "../auth.middleware";

const router = Router();
router.get("/", getRecipesHandler);
router.get("/:id", getRecipeByIdHandler);
router.post("/", createRecipeHandler);
router.delete("/:id", requireApiKey, deleteRecipeHandler);

export default router;