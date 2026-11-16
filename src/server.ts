import express from "express";

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

})

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});