import express from "express";

const app = express();
app.use(express.json());        // erlaubt dem Server, JSON im Request-Body zu lesen

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});