import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const zodRequestValidate =
  (zodSchema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body)
    try {
      // req.body =JSON.parse(req.body.data || {}) || req.body
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      console.log("before check",req.body)
      req.body = await zodSchema.parseAsync(req.body);
      console.log(req.body)
      next();
    } catch (error) {
      next(error);
    }
  };
