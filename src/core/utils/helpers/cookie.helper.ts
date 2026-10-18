import { CookieOptions, Request, Response } from "express";
const REFRESH_COOKIE = "refreshToken";

function cookieOptions(req: Request): CookieOptions {
  return {
    httpOnly: true,
    secure: req.secure, // true для https, false для http://localhost
    sameSite: "strict" as const,
    path: "/api/auth",
  };
}

export function setRefreshCookie(
  req: Request,
  res: Response,
  token: string,
  exp: number,
) {
  res.cookie(REFRESH_COOKIE, token, {
    ...cookieOptions(req),
    maxAge: exp * 1000 - Date.now(),
  });
}

export function clearRefreshCookie(req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE, cookieOptions(req));
}
