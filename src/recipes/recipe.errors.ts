export class RecipeNotFoundError extends Error {
  status = 404;
  constructor(id: number) {
    super(`Rezept mit ID ${id} nicht gefunden`);
    this.name = new.target.name;
  }
}