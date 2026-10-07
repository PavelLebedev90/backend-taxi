import { sign, SignOptions, verify } from "jsonwebtoken";
import { WithId } from "mongodb";
import { User } from "../../users/types/user.types";
import { JWT_SECRET } from "../../settings/config";
import { HttpStatus } from "../types/http-statuses";

const options = {
  algorithm: "HS256",
  expiresIn: "1d",
  issuer: "auth.taxi.com",
  audience: "api.taxi.com",
} satisfies SignOptions;

export const JWTService = {
  createToken(payload: WithId<User>) {
    const token = sign(payload, JWT_SECRET, {
      ...options,
      subject: payload._id.toString(),
    });
    return { token };
  },
  verifyToken(token: string): WithId<User> {
    try {
      const payload = verify(token, JWT_SECRET, {
        algorithms: [options.algorithm],
        issuer: options.issuer,
        audience: options.audience,
      });
      return payload as WithId<User>;
    } catch (e) {
      throw new Error(`jwt not valid`, {
        cause: {
          status: HttpStatus.Unauthorized,
          field: "jwt",
        },
      });
    }
  },
};
