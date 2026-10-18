import {
  JsonWebTokenError,
  JwtHeader,
  JwtPayload,
  sign,
  SignOptions,
  verify,
} from "jsonwebtoken";
import { WithId } from "mongodb";
import { User } from "../../users/types/user.types";
import { JWT_SECRET } from "../../settings/config";
import { HttpStatus } from "../types/http-statuses";

const options = {
  algorithm: "HS256",
  issuer: "auth.taxi.com",
  audience: "api.taxi.com",
} satisfies SignOptions;

const ACCESS_TTL_SEC = 15 * 60; //15 минут в sec
const REFRESH_TTL_SEC = 30 * 24 * 60 * 60; //30 дней в sec
type TokenTyp = "at+jwt" | "rt+jwt";

export const JWTService = {
  createToken(payload: WithId<User>, typ: TokenTyp) {
    const ttlSec = typ === "at+jwt" ? ACCESS_TTL_SEC : REFRESH_TTL_SEC;
    const exp = Math.floor(Date.now() / 1000) + ttlSec; // момент истечения;
    const token = sign(payload, JWT_SECRET, {
      ...options,
      subject: payload._id.toString(),
      header: { alg: options.algorithm, typ },
      expiresIn: ttlSec,
    });
    return { token, exp };
  },
  verifyToken(
    token: string,
    typ: TokenTyp,
  ): { header: JwtHeader; payload: JwtPayload & WithId<User> } {
    try {
      const { header, payload } = verify(token, JWT_SECRET, {
        algorithms: [options.algorithm],
        issuer: options.issuer,
        audience: options.audience,
        complete: true,
      });
      if (header.typ !== typ) {
        throw new JsonWebTokenError("invalid typ");
      }
      return { payload: payload as WithId<User>, header };
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new Error(e.message, {
          cause: {
            status: HttpStatus.Unauthorized,
            field: "jwt",
          },
        });
      }
      throw new Error(`jwt not valid`, {
        cause: {
          status: HttpStatus.Unauthorized,
          field: "jwt",
        },
      });
    }
  },
};
