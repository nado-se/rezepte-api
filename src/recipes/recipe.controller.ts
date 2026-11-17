import { Request, Response, NextFunction } from "express";
import { getAllRecipes, getRecipeById, createRecipe, deleteRecipe } from "./recipe.service";

export async function getRecipesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const rezepte = await getAllRecipes();
    res.json(rezepte);
  } catch (err) {
    next(err);
  }
}

export async function getRecipeByIdHandler(req: Request, res: Response, next: NextFunction) {

    let id: number;
    let recipe;

    try {
        id = Number(req.params.id);
        recipe = await getRecipeById(id);

        if(!recipe) {
            return res.status(404).json({ fehler: "Rezept nicht gefunden" });
        }

        return res.status(200).json({ success: "ok", data: recipe });

    } catch(err) {
        next(err);
    }
}

export async function createRecipeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const neues = await createRecipe(req.body);
    res.status(201).json(neues);
  } catch (err) {
    next(err);
  }
}

export async function deleteRecipeHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: number = Number(req.params.id) ?? null
        const deleted = await deleteRecipe(id);

        if(deleted) {
            res.status(204).send()
        } else {
            res.status(404).json({ fehler: "Rezept nicht gefunden" });
        }
    } catch(err) {
        next(err);
    }
}