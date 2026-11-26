import "dotenv/config";
import app from "./app.ts";
import { getPostgresPool } from "./pool.postgres.ts";

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

let shuttingDown = false;

function shutdown(signal: NodeJS.Signals): void {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`${signal} empfangen, Server wird beendet.`);

  server.close((error) => {
    if (error) {
      console.error("Fehler beim Schließen des HTTP-Servers:", error);
      process.exitCode = 1;
    }

    void getPostgresPool()
      .end()
      .then(() => {
        console.log("PostgreSQL-Pool wurde geschlossen.");
      })
      .catch((poolError: unknown) => {
        console.error("Fehler beim Schließen des PostgreSQL-Pools:", poolError);
        process.exitCode = 1;
      });
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));