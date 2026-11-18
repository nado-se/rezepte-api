export class RecipeNotFoundError extends Error {
  status = 404;
  constructor(id: number) {
    super(`Rezept mit ID ${id} nicht gefunden`);
    this.name = new.target.name;
  }
}

export class ValidationError  extends Error {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}