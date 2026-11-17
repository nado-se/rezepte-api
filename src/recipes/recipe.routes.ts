import { Router } from "express";
import { getRecipesHandler, getRecipeByIdHandler, createRecipeHandler, deleteRecipeHandler } from "./recipe.controller";

const router = Router();
router.get("/", getRecipesHandler);
router.get("/:id", getRecipeByIdHandler);
router.post("/", createRecipeHandler);
router.delete("/:id", deleteRecipeHandler);

export default router;