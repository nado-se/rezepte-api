import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    res.on("finish", () => {
        const timeBetween = Date.now() - startTime;
        console.log(`${req.method} ${req.url} → ${res.statusCode} (${timeBetween} ms)`);
    });
    next();
}

