import { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY;

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header("x-api-key");

    if (!API_KEY || !apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: "Nicht autorisiert" });
    }
    next();
}