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
    zutaten: ZutatenGruppe,
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

    let foundRecipe: Rezept | null;

    foundRecipe = rezepte.find( recipe => recipe.id === Number(id)) ?? null;

    return foundRecipe;
}