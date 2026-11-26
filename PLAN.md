# PLANNING.md - Entwicklungsleitfaden

Dieses Dokument beschreibt die geltenden Regeln und Strukturen der Rezepte-API.
Neue Features und Änderungen sollen diesem Leitfaden folgen.

## 1. Projektübersicht

- TypeScript/Node.js-API mit Express
- PostgreSQL über `pg`
- Lokaler Start über `tsx`
- OpenAPI-/Swagger-Dokumentation mit `swagger-jsdoc` und `swagger-ui-express`
- Deployment der Express-App über Vercel
- Aktuelles Fachmodul: Rezepte mit Zutaten

## 2. Projektstruktur

```text
src/
  app.ts                 Express-App, Middleware-Reihenfolge und Swagger
  server.ts              lokaler HTTP-Server und Shutdown
  pool.postgres.ts       PostgreSQL-Singleton
  auth.middleware.ts     API-Key-Prüfung
  logger.middleware.ts   Request-Logging
  error.middleware.ts    zentrale Fehlerausgabe
  api/
    index.ts             Vercel-Einstiegspunkt
  recipes/
    recipe.router.ts     Routen und OpenAPI-Kommentare
    recipe.controller.ts HTTP-Adapter
    recipe.service.ts    Fachlogik und Validierung
    recipe.repo.ts       SQL und Datenbankzugriff
    recipe.errors.ts     fachliche Fehlerklassen
db/
  schema.sql             Datenbankschema und Basisdaten
docker-compose.yml       lokale PostgreSQL-Instanz
```

Weitere fachliche Module sollen analog als eigener Ordner unter `src/<modul>/`
mit `*.router.ts`, `*.controller.ts`, `*.service.ts`, `*.repo.ts` und
`*.errors.ts` aufgebaut werden.

## 3. Architekturschichten

Die Abhängigkeiten laufen in dieser Richtung:

```text
Router -> Controller -> Service -> Repository -> PostgreSQL
```

- Router: HTTP-Pfade, HTTP-Methode, Swagger-Dokumentation und Middleware
- Controller: Request-Daten übernehmen, Service aufrufen und HTTP-Antwort senden
- Service: Fachlogik, Validierung und fachliche Fehler
- Repository: ausschließlich Datenbankzugriff und SQL
- Middleware: querschnittliche Aufgaben wie Logging, Authentifizierung und Fehler

SQL gehört nicht in Controller oder Service. HTTP- und Express-Typen gehören nicht
in Service oder Repository.

## 4. Namenskonventionen

- Dateien: kebab-case
- Ordner für Fachmodule: kleingeschrieben und fachbezogen
- Funktionen: camelCase
- Klassen: PascalCase
- Konstanten: camelCase oder UPPER_SNAKE_CASE für unveränderliche Konfiguration
- TypeScript-Typen: PascalCase
- Datenbanktabellen und -spalten: snake_case
- API-JSON-Felder: vorerst konsistent mit den bestehenden deutschen Fachfeldern
  (`titel`, `minuten`, `portionen`, `schwierigkeit`, `zutaten`)
- Datenbankfelder werden in englisch benannt (`title`, `minutes`, `portions`,
  `difficulty`) und bei Bedarf in der Service-/Type-Sicht angepasst

Neue APIs sollen die bestehenden Bezeichnungsregeln nicht ohne klare Migration
vermischen.

## 5. TypeScript-Regeln

- TypeScript strict mode ist aktiv
- Keine `any`-Typen in neuem oder geändertem Code
- Keine impliziten Rückgabewerte in öffentlichen Funktionen
- `unknown` für unverifizierte externe Eingaben verwenden
- Import-Endungen gemäß aktuellem Stand beibehalten: `.ts`
- Für asynchrone Operationen `async/await` verwenden
- Fehlerobjekte nicht als Platzhalter behandeln
- Parameter und Rückgabetypen ausnahmslos explizit definieren

Vor jeder Übergabe prüfen:

```bash
npm run typecheck
```

## 6. Express- und HTTP-Regeln

- `app.ts` exportiert die Express-App, startet sie aber nicht
- `src/server.ts` startet den lokalen HTTP-Server
- `src/api/index.ts` stellt die App für Vercel bereit
- Middleware-Reihenfolge in `app.ts`:
  1. Swagger
  2. JSON-Body-Parser
  3. Request-Logger
  4. App-Routen
  5. 404-Handler
  6. zentraler Fehlerhandler
- Jeder Handler soll Fehler über `next(err)` an den zentralen Fehlerhandler geben
- Routen werden unter einem fachlichen Präfix registriert
- Aktuelles Präfix: `/recipes`
- Pfadparameter mit `Number(...)` validieren und erst anschließend verwenden
- Keine fachlichen Entscheidungen ausschließlich im Controller treffen

Die HTTP-Antworten richten sich nach Statussemantik:

- `200 OK`: Ressource oder Liste erfolgreich gelesen
- `201 Created`: Ressource erfolgreich erstellt
- `204 No Content`: erfolgreiche Mutation ohne Rückgabekörper
- `400 Bad Request`: ungültige Eingabe
- `401 Unauthorized`: API-Key fehlt oder ist ungültig
- `404 Not Found`: Ressource nicht vorhanden
- `500 Internal Server Error`: unerwarteter Serverfehler

## 7. Rezepte-Modell

Die Anwendung verwendet diesen bestehenden TypeScript-Typ:

```ts
type Zutat = {
  name: string;
  menge: string;
};

type Rezept = {
  id: number;
  titel: string;
  minuten: number;
  portionen: number;
  schwierigkeit: string;
  zutaten?: Zutat[];
};
```

- `zutaten` ist optional und wird nur in der Detailansicht gefüllt
- Listenrouten müssen keine Zutaten laden
- Detailrouten müssen die Zutaten des Rezepts enthalten
- Erstellungsdaten enthalten keine `id`
- Datenbankzeilen dürfen nicht ungeprüft als öffentliche API-Felder durchgereicht
  werden

## 8. Validierung

Validierung erfolgt im Service:

- Titel darf nicht leer sein
- Rezept-ID muss eine positive Ganzzahl sein
- Zutatentitel darf nicht leer sein
- Mengenangabe darf nicht leer sein
- Alle externen Eingaben werden vor Datenbankzugriffen geprüft

Neue Prüfungen sollen bei ähnlichen Daten bereits in einem gemeinsam verwendeten
Typ oder Validator gebündelt werden, statt in jedem Controller dupliziert zu werden.

## 9. Fehlerbehandlung

- Fachliche Fehler liegen in `recipe.errors.ts`
- Bestehende Klassen:
  - `RecipeNotFoundError`: HTTP 404
  - `ValidationError`: HTTP 400
- Neue fachliche Fehler erhalten ihre eigene Klasse und Statusdefinition
- Der zentrale Fehlerhandler übersetzt bekannte Fehler in JSON
- Öffentliches Fehlerformat für bekannte Fehler: `{ "error": "..." }`
- Ausnahmeverhalten und 500-Antworten dürfen keine Secrets oder Stacktraces
  preisgeben

Neue Fehlerantworten sollen ausschließlich das gemeinsame
`{ "error": "..." }`-Format verwenden.

## 10. Datenbank

- PostgreSQL wird über `getPostgresPool()` als Singleton bereitgestellt
- Nur parameterisierte SQL-Abfragen verwenden
- Niemals Werte direkt in SQL-Strings interpolieren
- Änderungen an `db/schema.sql` müssen rückwärtsverträglich geplant werden
- Fremdschlüssel:
  - `recipe_ingredient.recipe_id` löscht Verknüpfungen über `ON DELETE CASCADE`
  - `recipe_category` verwendet eine relationale Zuordnung zu Rezepten
- Mehrere verwandte Datenbankoperationen werden in einer Transaktion gebündelt,
  sobald atomisches Verhalten erforderlich ist
- Große Listen sollen bei Bedarf paginiert werden
- Keine SQL-Ergebnisse direkt verändern, bevor die Service-Grenze geprüft wurde

Die Datenbankkonfiguration nutzt folgende Umgebungsvariablen:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `API_KEY` für den API-Key-Middleware

Keine `.env`-Inhalte committen. `.env` wird bereits durch `.gitignore`
ausgeschlossen.

## 11. Lokale Entwicklung

```bash
npm install
npm run dev
npm run typecheck
```

Lokaler API-Start:

- Server: `http://localhost:3000`
- Swagger-Dokumentation: `http://localhost:3000/docs`
- Gesundheit: `http://localhost:3000/health`

PostgreSQL lokal starten:

```bash
docker compose up -d db
```

Das Schema muss zunächst in die Datenbank geladen werden. Die IDs in Beispieldaten
sind nicht als stabile Produktionswerte anzusehen.

## 12. Authentifizierung

- Geschützte Mutation-Routen verwenden `requireApiKey`
- API-Key wird aus dem Header `x-api-key` gelesen
- Nicht gleich: `401` mit dem bestehenden Fehlerformat
- Neue geschützte Routen müssen dieselbe Middleware verwenden
- Der API-Key darf niemals in Dokumentation, Tests oder Commits landen

Derzeit ist das Löschen eines Rezepts die geschützte Route.

## 13. OpenAPI und Swagger

- OpenAPI-Version: `3.0.0`
- Swagger-Kommentare liegen direkt in `*.router.ts`
- Die Konfiguration wird in `app.ts` erzeugt
- Neue öffentlich erreichbare Routen müssen dokumentiert werden
- An jedem Endpunkt müssen mindestens `tags`, `summary`, `parameters` oder
  `requestBody` sowie relevante `responses` angegeben werden
- Gemeinsame Schemas gehören in den `components.schemas`-Bereich
- Bei API-Formaten ist die OpenAPI-Dokumentation gemeinsam mit der Implementierung
  anzupassen

## 14. Tests und Qualität

Aktuell sind keine automatisierten Testskripte oder Testfiles definiert.
Neue fachliche Änderungen sollen mindestens getestet werden mit:

- Happy-Path-Test
- Validierungsfehler
- Nicht gefundene Ressource
- Datenbankfehler
- Geschützte Route mit fehlendem und ungültigem API-Key

Bis eine Testinfrastruktur besteht, ist `npm run typecheck` das Mindestmaß.
Zusätzliche manuelle API-Prüfungen gehören in die Umsetzung oder PR-Beschreibung.

## 15. Änderungen umsetzen

Vor einer Änderung:

1. Passendes Fachmodul und betroffene Schicht bestimmen
2. Bestehende Typen und SQL-Abfragen lesen
3. Datenbankänderung sowie API-Auswirkung prüfen
4. Kleinste passende Änderung implementieren
5. Betroffene OpenAPI-Dokumentation aktualisieren
6. Typecheck und manuelle API-Prüfung durchführen
7. Keine unbeteiligten Dateien oder Formatierungen verändern

Bei einem neuen Modul:

1. Ordner unter `src/<modul>/` anlegen
2. Typen und Fachfehler definieren
3. Repository implementieren
4. Service implementieren
5. Controller implementieren
6. Router und OpenAPI-Dokumentation ergänzen
7. Router in `app.ts` registrieren
8. Datenbankschema aktualisieren
9. Validierungs- und API-Fälle testen

## 16. Bekannte Inkonsistenzen

Diese Punkte sind bekannte technische Schulden und dürfen nicht ungeprüft kopiert werden:

- Für die API sind noch keine automatisierten Tests eingerichtet
