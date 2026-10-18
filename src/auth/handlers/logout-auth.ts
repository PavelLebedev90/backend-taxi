import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { authService } from "../application/auth.service";
import { clearRefreshCookie } from "../../core/utils/helpers/cookie.helper";

export const logoutAuth = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  await authService.logout(token);
  clearRefreshCookie(req, res);
  res.sendStatus(HttpStatus.NoContent);
};
