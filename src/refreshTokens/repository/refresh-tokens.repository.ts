import { refreshTokenBlackListCollection } from "../../db/collections";
import { RefreshToken } from "../types/refresh-token.types";

export const refreshTokensRepository = {
  async getRefreshTokenByToken(token: string) {
    return await refreshTokenBlackListCollection.findOne({ token });
  },
  async create(bodyToken: RefreshToken) {
    return await refreshTokenBlackListCollection.insertOne(bodyToken);
  },
};
