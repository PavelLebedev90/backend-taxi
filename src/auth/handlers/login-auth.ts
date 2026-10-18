import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { authService } from "../application/auth.service";
import { AuthLoginInput } from "../dto/user.input.dto";
import { setRefreshCookie } from "../../core/utils/helpers/cookie.helper";

export const loginAuth = async (
  req: Request<{}, {}, AuthLoginInput>,
  res: Response<{ token: string }>,
) => {
  const { accessToken, refreshToken } = await authService.loginAuth(req.body);
  setRefreshCookie(req, res, refreshToken.token, refreshToken.exp);
  res.status(HttpStatus.Ok).send({ token: accessToken.token });
};
