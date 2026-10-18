import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { authService } from "../application/auth.service";
import { setRefreshCookie } from "../../core/utils/helpers/cookie.helper";

export const refreshAuth = async (
  req: Request,
  res: Response<{ token: string }>,
) => {
  const refresh = req.cookies.refreshToken as string;
  const { accessToken, refreshToken } = await authService.refresh(refresh);
  setRefreshCookie(req, res, refreshToken.token, refreshToken.exp);
  res.status(HttpStatus.Ok).send({ token: accessToken.token });
};
