import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// validation middleware: checks the request body against a Zod schema before the controller runs
export const validate =
  (schema: z.ZodObject<z.ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.issues,
      });
      return;
    }

    // replace the body with the parsed (and cleaned) data
    req.body = validation.data;
    next();
  };
