import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserCreateInput } from "../../users/dto/user.input.dto";
import { authService } from "../application/auth.service";

export const registrationAuth = async (
  req: Request<unknown, unknown, UserCreateInput>,
  res: Response,
) => {
  await authService.registrationAuth(req.body.data.attributes);
  res.sendStatus(HttpStatus.Created);
};
