import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { authService } from "../application/auth.service";

export const registrationConfirmationAuth = async (
  req: Request<unknown, { emailConfirmationCode: string }>,
  res: Response,
) => {
  await authService.registrationConfirmationAuth(
    req.body.emailConfirmationCode,
  );
  res.sendStatus(HttpStatus.NoContent);
};
