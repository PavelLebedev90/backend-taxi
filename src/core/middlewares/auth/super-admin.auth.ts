import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  BASE_AUTH_PREFIX,
} from "../../../settings/config";

export const superAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = authHeader.split(" ");

  if (authType !== BASE_AUTH_PREFIX) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [userName, password] = Buffer.from(token, "base64")
    .toString("utf-8")
    .split(":");

  if (userName !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  next();
};
