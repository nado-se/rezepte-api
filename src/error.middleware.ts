import { Request, Response, NextFunction } from "express";
import { RecipeNotFoundError, ValidationError } from "./recipes/recipe.errors.ts";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.log(err.name);
    console.log(err.message);
    if(!err.status) {
        err.status = 500;
    }
    if (err instanceof RecipeNotFoundError) {
        return res.status(err.status).json({ error: err.message })
    }

    if (err instanceof ValidationError) {
        return res.status(err.status).json({ error: err.message })
    }

    next(err);
}