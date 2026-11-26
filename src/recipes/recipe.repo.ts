import { getPostgresPool } from "../pool.postgres.ts";
import { Rezept } from "./recipe.service";

const pool = getPostgresPool();

// get all recipes without ingredients
export async function getAllRecipes(): Promise<Rezept[]> {
  const res = await pool.query(
    "SELECT id, title, minutes, portions, difficulty FROM recipe ORDER BY id"
  );
  return res.rows;
}

// create a new recipe
export async function createRecipe(
  titel: string,
  minuten: number,
  portionen: number,
  schwierigkeit: string
): Promise<Rezept> {
    const timestamp = new Date().toISOString();
    const res = await pool.query(
        "INSERT INTO recipe (title, minutes, portions, difficulty, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, minutes, portions, difficulty",
        [titel, minuten, portionen, schwierigkeit, timestamp]
  );
  return res.rows[0];
}

// get recipe with ingredients by ID
export async function getRecipeById(id: number): Promise<Rezept | null> {
  const rezeptRes = await pool.query(
    "SELECT id, title, minutes, portions, difficulty FROM recipe WHERE id = $1",
    [id]
  );

  if (rezeptRes.rows.length === 0) {
    return null;
  }

  const zutatenRes = await pool.query(
    "SELECT i.name, ri.amount FROM recipe_ingredient ri JOIN ingredient i ON i.id = ri.ingredient_id WHERE ri.recipe_id = $1",
    [id]
  );

  return { ...rezeptRes.rows[0], zutaten: zutatenRes.rows };
 }

// delete one recipe by recipe ID
export async function deleteRecipe(id: number): Promise<void> {
  await pool.query("DELETE FROM recipe WHERE id = $1", [id]);
}

// add an ingredient to a recipe
export async function addIngredientToRecipe(
  recipeId: number,
  ingredientName: string,
  amount: string
): Promise<void> {
  const timestamp = new Date().toISOString();
  const ingredientRes = await pool.query(
    "INSERT INTO ingredient (name, created_at) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
    [ingredientName, timestamp]
  );
  const ingredientId = ingredientRes.rows[0].id;

  await pool.query(
    "INSERT INTO recipe_ingredient (recipe_id, ingredient_id, amount, created_at) VALUES ($1, $2, $3, $4)",
    [recipeId, ingredientId, amount, timestamp]
  );
}