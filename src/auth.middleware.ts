import { Request, Response, NextFunction } from "express";

const API_KEY = "geheim123";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
    let apiKey: string | undefined;

    apiKey = req.header("x-api-key");

    if(apiKey !== API_KEY) {
        return res.status(401).json({ fehler: "Nicht autorisiert" });
    }
    next();
}