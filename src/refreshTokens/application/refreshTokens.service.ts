import { refreshTokensRepository } from "../repository/refresh-tokens.repository";
import { RefreshToken } from "../types/refresh-token.types";

export const refreshTokensService = {
  async getRefreshTokenByToken(token: string) {
    return await refreshTokensRepository.getRefreshTokenByToken(token);
  },
  async create(bodyToken: RefreshToken) {
    return await refreshTokensRepository.create(bodyToken);
  },
};
