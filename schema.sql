CREATE TABLE IF NOT EXISTS "recipe"(
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "minutes" INTEGER NULL,
    "portions" INTEGER NULL,
    "difficulty" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "recipe" ADD PRIMARY KEY("id");
CREATE TABLE IF NOT EXISTS "recipe_category"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "recipe_id" BIGINT NOT NULL
);
  ALTER TABLE
      "recipe_category" ADD PRIMARY KEY("id");
CREATE TABLE IF NOT EXISTS "ingredient"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "ingredient" ADD PRIMARY KEY("id");
ALTER TABLE
    "ingredient" ADD CONSTRAINT "ingredient_name_unique" UNIQUE("name");
CREATE TABLE IF NOT EXISTS "recipe_ingredient"(
    "recipe_id" BIGINT NOT NULL,
    "ingredient_id" BIGINT NOT NULL,
    "amount" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "recipe_ingredient" ADD PRIMARY KEY("recipe_id", "ingredient_id");
ALTER TABLE
    "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_foreign" FOREIGN KEY("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE;
ALTER TABLE
    "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_foreign" FOREIGN KEY("ingredient_id") REFERENCES "ingredient"("id");

  
  INSERT INTO recipe (title, minutes, portions, difficulty, created_at) VALUES
  ('Spaghetti Carbonara', 20, 2, null, now()),
  ('Linsen-Curry',        35, 4, null, now()),
  ('Maultaschen', 15, 3, 'Einfach', now());

  INSERT INTO ingredient (name, created_at) VALUES
  ('Spaghetti', now()), 
  ('Ei', now()), 
  ('Speck', now()), 
  ('Linsen', now()), 
  ('Kokosmilch', now()), 
  ('Zwiebel', now()),
  ('Mehl', now()),
  ('Petersilie', now()),
  ('Spinat', now()),
  ('Brötchen', now());
  

  INSERT INTO recipe_ingredient (recipe_id, ingredient_id, amount, created_at) VALUES
  (1, 1, '200 g', now()),   -- Carbonara: Spaghetti
  (1, 2, '2 Stück', now()), -- Carbonara: Ei
  (1, 3, '100 g', now()),   -- Carbonara: Speck
  (2, 4, '250 g', now()),   -- Curry: Linsen
  (2, 5, '400 ml', now()),  -- Curry: Kokosmilch
  (2, 6, '1 Stück', now()), -- Curry: Zwiebel
  (3, 7, '200 g', now()),   -- Maultaschen: Mehl
  (3, 2, '3 Stück', now()), -- Maultaschen: Ei
  (3, 8, '50 g', now()),   -- Maultaschen: Petersilie
  (3, 9, '500 g', now()),   -- Maultaschen: Spinat
  (3, 10, '1 Stück', now());  -- Maultaschen: Brötchen
  
  -- Alle Rezepte, alle Spalten.
  SELECT * FROM recipe;

  -- Nur titel und minuten.
  SELECT title AS "Titel", minutes AS "Minuten" FROM recipe;

  -- Alle Rezepte, die in höchstens 30 Minuten fertig sind (WHERE minuten <= 30).
  SELECT title AS "Rezepte max 30 Minuten" FROM recipe
    WHERE minutes <= 30;


  -- Alle Rezepte, sortiert nach Zubereitungszeit, die schnellsten zuerst (ORDER BY ... ASC).
  SELECT title AS "Titel nach Zubereitungszeit", minutes AS "Zubereitungszeit" FROM recipe
    ORDER BY minutes;

  -- Wie viele Rezepte gibt es insgesamt? (SELECT COUNT(*) ...)
  SELECT count(id) AS "Anzahl Rezepte gesamt" FROM recipe;

  -- Die Zutaten eines Rezepts — hier brauchst du einen JOIN über drei Tabellen, weil die Verknüpfung in rezept_zutaten liegt:
  SELECT recipe.title AS "Rezepttitel", ingredient.name AS "Zutatenname", ri.amount AS "Menge"
    FROM ingredient
    JOIN recipe_ingredient AS ri ON ri.ingredient_id = ingredient.id
    JOIN recipe ON ri.recipe_id = recipe.id
    WHERE recipe.id = 1;

    -- Update Rezept
    SELECT * FROM recipe ORDER BY title;

    UPDATE recipe SET portions = 6 WHERE title = 'Linsen-Curry';

    --DELETE rezept
    --CASCADE testen: Lösch ein Rezept (DELETE FROM rezepte WHERE id = 1;) und prüfe: Die Verknüpfungen in rezept_zutaten verschwinden dank ON DELETE CASCADE automatisch mit — die zutaten selbst aber bleiben (sie gehören ja niemandem allein).

    SELECT * FROM recipe ORDER BY title;
    SELECT * FROM recipe_ingredient;
    DELETE FROM recipe WHERE id = 1;

    SELECT * FROM recipe ORDER BY title;
    SELECT * FROM recipe_ingredient;


  -- Andersherum: In welchen Rezepten kommt eine bestimmte Zutat vor? (JOIN, aber WHERE z.name = 'Zwiebel'.)
  SELECT recipe.title AS "Rezepttitel", ingredient.name AS "Zutatenname", ri.amount AS "Menge"
    FROM ingredient
    JOIN recipe_ingredient AS ri ON ri.ingredient_id = ingredient.id
    JOIN recipe ON ri.recipe_id = recipe.id
    WHERE ingredient.name = 'Ei';


--Zählen: Wie viele Zutaten hat jedes Rezept? (JOIN + GROUP BY r.titel + COUNT(*).)
SELECT recipe.title, count(ingredient.id) FROM ingredient
JOIN recipe_ingredient AS ri ON ri.ingredient_id = ingredient.id
JOIN recipe ON ri.recipe_id = recipe.id
GROUP BY recipe.title;




--Vierte Tabelle (1:n): eine kategorien-Tabelle, auf die rezepte per Foreign Key verweist (ein Rezept hat eine Kategorie, eine Kategorie viele Rezepte).

INSERT INTO recipe_category (name, recipe_id) VALUES('Vegetarisch', 2);

SELECT recipe.title, recipe_category.name FROM recipe
  LEFT JOIN recipe_category ON recipe.id = recipe_category.recipe_id;