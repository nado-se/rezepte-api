import { Request, Response, NextFunction } from "express";
import { getAllRecipes, getRecipeById } from "./recipe.service";

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