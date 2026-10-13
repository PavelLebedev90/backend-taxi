import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { authService } from "../application/auth.service";

export const registrationEmailResendingAuth = async (
  req: Request<unknown, { email: string }>,
  res: Response,
) => {
  await authService.registrationEmailResendingAuth(req.body.email);
  res.sendStatus(HttpStatus.NoContent);
};
