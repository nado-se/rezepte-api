import express from "express";

const rezepte = [
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

const app = express();
app.use(express.json());        // erlaubt dem Server, JSON im Request-Body zu lesen

const PORT = 3000;


// Begrüßung auf der Startseite
app.get("/", (req, res) => {
  res
    .status(200)
    .json({message: "Willkommen bei der Rezepte-API 👋"});
});


//health check
app.get("/health", (req, res) => {
    res
      .status(200)
      .json({message: "ok"});

});

//get all recipes
app.get("/recipes", (req, res) => {
    res
      .status(200)
      .json({rezepte});
});

// get single recipe
app.get("/recipes/:id", (req, res) => {

  let message: string;
  let rezept;


  //get ID
  const { id: recipeId } = req.params;
  const id = Number(recipeId);

  //find matching recipe
  if(id) {
    rezept = rezepte.find( recipe => recipe.id === id);
  }

  if (!rezept) {
    // recipe not found
    message = "Rezept nicht gefunden";

    res
      .status(404)
      .json({ fehler: `${message}` });
      return;
  }

  // found recipe as JSON
  res
      .status(200)
      .json({ rezept });
  
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});