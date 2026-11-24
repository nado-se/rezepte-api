CREATE TABLE "recipe"(
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
CREATE TABLE "ingredient"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "ingredient" ADD PRIMARY KEY("id");
ALTER TABLE
    "ingredient" ADD CONSTRAINT "ingredient_name_unique" UNIQUE("name");
CREATE TABLE "recipe_ingredient"(
    "recipe_id" BIGINT NOT NULL,
    "ingredient_id" BIGINT NOT NULL,
    "amount" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL
);
ALTER TABLE
    "recipe_ingredient" ADD PRIMARY KEY("recipe_id");
ALTER TABLE
    "recipe_ingredient" ADD PRIMARY KEY("ingredient_id");
ALTER TABLE
    "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipe_id_foreign" FOREIGN KEY("recipe_id") REFERENCES "recipe"("id");
ALTER TABLE
    "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_ingredient_id_foreign" FOREIGN KEY("ingredient_id") REFERENCES "ingredient"("id");