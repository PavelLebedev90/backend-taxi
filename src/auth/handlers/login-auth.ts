import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { authService } from "../application/auth.service";
import { AuthLoginInput } from "../dto/user.input.dto";

export const loginAuth = async (
  req: Request<unknown, unknown, AuthLoginInput>,
  res: Response<{ token: string }>,
) => {
  const authId = await authService.loginAuth(req.body);
  res.status(HttpStatus.Ok).send({ token: authId.toString() });
};
