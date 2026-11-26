CREATE TABLE IF NOT EXISTS "recipe_category"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "recipe_category" ADD PRIMARY KEY("id");
CREATE TABLE IF NOT EXISTS "recipe"(
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "minutes" INTEGER NULL,
    "portions" INTEGER NULL,
    "difficulty" VARCHAR(255) NULL,
    "category_id" INTEGER NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "recipe" ADD PRIMARY KEY("id");
CREATE UNIQUE INDEX IF NOT EXISTS "recipe_category_name_unique"
    ON "recipe_category"("name");
ALTER TABLE
    "recipe" ADD CONSTRAINT "recipe_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "recipe_category"("id");
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

  
  INSERT INTO recipe (title, minutes, portions, difficulty, created_at)
  SELECT seed.title, seed.minutes, seed.portions, seed.difficulty, now()
  FROM (
    VALUES
      ('Spaghetti Carbonara', 20, 2, null),
      ('Linsen-Curry', 35, 4, null),
      ('Maultaschen', 15, 3, 'Einfach')
  ) AS seed(title, minutes, portions, difficulty)
  WHERE NOT EXISTS (
    SELECT 1 FROM recipe existing WHERE existing.title = seed.title
  );

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
  ('Brötchen', now())
  ON CONFLICT (name) DO NOTHING;
  

  INSERT INTO recipe_ingredient (recipe_id, ingredient_id, amount, created_at)
  SELECT r.id, i.id, amounts.amount, now()
  FROM (
    VALUES
      ('Spaghetti Carbonara', 'Spaghetti', '200 g'),
      ('Spaghetti Carbonara', 'Ei', '2 Stück'),
      ('Spaghetti Carbonara', 'Speck', '100 g'),
      ('Linsen-Curry', 'Linsen', '250 g'),
      ('Linsen-Curry', 'Kokosmilch', '400 ml'),
      ('Linsen-Curry', 'Zwiebel', '1 Stück'),
      ('Maultaschen', 'Mehl', '200 g'),
      ('Maultaschen', 'Ei', '3 Stück'),
      ('Maultaschen', 'Petersilie', '50 g'),
      ('Maultaschen', 'Spinat', '500 g'),
      ('Maultaschen', 'Brötchen', '1 Stück')
  ) AS amounts(recipe_title, ingredient_name, amount)
  JOIN recipe r ON r.title = amounts.recipe_title
  JOIN ingredient i ON i.name = amounts.ingredient_name
  ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
  
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
    WHERE recipe.title = 'Spaghetti Carbonara';

    -- Update Rezept
    SELECT * FROM recipe ORDER BY title;

    UPDATE recipe SET portions = 6 WHERE title = 'Linsen-Curry';

    --DELETE rezept
    --CASCADE testen: Lösch ein Rezept (DELETE FROM recipe WHERE title = 'Spaghetti Carbonara';) und prüfe: Die Verknüpfungen in recipe_ingredient verschwinden dank ON DELETE CASCADE automatisch mit — die Zutaten selbst bleiben erhalten.

    SELECT * FROM recipe ORDER BY title;
    SELECT * FROM recipe_ingredient;
    DELETE FROM recipe WHERE title = 'Spaghetti Carbonara';

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




-- Eine Kategorie kann vielen Rezepten zugeordnet sein; jedes Rezept verweist auf eine Kategorie.
INSERT INTO recipe_category (name)
VALUES ('Vegetarisch')
ON CONFLICT (name) DO NOTHING;

UPDATE recipe
SET category_id = recipe_category.id
FROM recipe_category
WHERE recipe_category.name = 'Vegetarisch'
  AND recipe.title = 'Linsen-Curry'
  AND recipe.category_id IS DISTINCT FROM recipe_category.id;

SELECT recipe.title, recipe_category.name FROM recipe
  LEFT JOIN recipe_category ON recipe.category_id = recipe_category.id;