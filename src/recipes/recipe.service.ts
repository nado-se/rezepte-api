import { RecipeNotFoundError, ValidationError } from "./recipe.errors.ts";


export type Zutat = { name: string; menge: string };
export type Rezept = {
  id: number;
  titel: string;
  minuten: number;
  portionen: number;
  schwierigkeit: string, 
  zutaten?: Zutat[];        // nur bei getRecipeById gefüllt (Detail-Ansicht)
};

import {
  getAllRecipes as getAllFromDb,
  getRecipeById as getByIdFromDb,
  createRecipe as createInDb,
  deleteRecipe as deleteInDb,
} from "./recipe.repo.ts";


export async function getAllRecipes(): Promise<Rezept[]> {
  return getAllFromDb();
}

export async function getRecipeById(id: number): Promise<Rezept | null> {

    const foundRecipe = getByIdFromDb(Number(id));
    if(!foundRecipe) {
      throw new RecipeNotFoundError(id);
    }
    return foundRecipe;
}


export async function createRecipe(data: Omit<Rezept, "id">): Promise<Rezept> {
  if (!data.titel || data.titel.trim() === "") {
    throw new ValidationError("Ein Rezept braucht einen Titel.");
  }

  return await createInDb(
    data.titel,
    data.minuten,
    data.portionen,
    data.schwierigkeit
  );
}


export async function deleteRecipe(id: number): Promise<boolean> {
  const recipe = await getByIdFromDb(id);
  if (!recipe) {
    return false;
  }

  await deleteInDb(id);

  return true;
}