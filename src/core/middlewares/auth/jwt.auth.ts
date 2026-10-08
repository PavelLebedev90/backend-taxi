import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses";
import { JWTService } from "../../application/jwt.service";

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = authHeader.split(" ");

  if (authType !== "Bearer") {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const verifyUser = JWTService.verifyToken(token);

  res.locals.user = verifyUser;
  next();
};
