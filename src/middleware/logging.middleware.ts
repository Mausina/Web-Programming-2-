import { Request, Response, NextFunction } from "express";

// simple request logger: prints the method and url of every request
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
