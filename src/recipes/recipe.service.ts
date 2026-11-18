import { RecipeNotFoundError, ValidationError } from "./recipe.errors";


type ZutatenGruppe = [
    { bestandteile: string[] },
    { gewuerze: string[] },
    { optional: string[] },
]


export type Rezept = { 
    id: number; 
    titel: string; 
    minuten: number; 
    portionen: number, 
    schwierigkeit: string, 
    zutaten?: ZutatenGruppe,
};

let rezepte: Rezept[] = [
  { 
    id: 1, 
    titel: "Spaghetti Carbonara", 
    minuten: 20, 
    portionen: 2,
    schwierigkeit: "Einfach", 
    zutaten: [
      { bestandteile: ["Spaghetti", "Schinken", "Eier"]},
      { gewuerze: ["Salz", "Pfeffer"] },
      { optional: ["Parmesan"] },
    ],
  },
  {
    id: 2,
    titel: "Linsen-Curry",
    minuten: 30,
    portionen: 4,
    schwierigkeit: "Fortgeschritten",
    zutaten: [
      { bestandteile: ["Reis", "Kartoffeln", "Karotten", "Linsen"]},
      { gewuerze: ["Knoblauch", "Curry"] },
      { optional: ["Erbsen", "Paprika"] },
    ],

  }
];

export async function getAllRecipes(): Promise<Rezept[]> {
  return rezepte;
}

export async function getRecipeById(id: number): Promise<Rezept | null> {

    const foundRecipe = rezepte.find((recipe) => recipe.id === id);
    if(!foundRecipe) {
      throw new RecipeNotFoundError(id);
    }
    return foundRecipe;
}


let naechsteId = 3;


export function createRecipe(daten: Omit<Rezept, "id">) {

  const neues: Rezept = { id: naechsteId++, ...daten };
  if(!neues.titel || neues.titel.trim() === "") {
    throw new ValidationError("Ein Rezept braucht einen Titel.");
  }
  rezepte.push(neues);
  return neues;
}

export async function deleteRecipe(id: number): Promise<boolean> {
    let foundRecipe: Rezept | null;
    let oldRecipes: Rezept[];

    oldRecipes = rezepte;

    foundRecipe = rezepte.find( recipe => recipe.id === Number(id)) ?? null;

    if(!foundRecipe) {
        return false;
    }

    rezepte = rezepte.filter( recipe => recipe !== foundRecipe);

    if(oldRecipes.length > rezepte.length) {
        return true;
    } else {
        return false;
    }
}