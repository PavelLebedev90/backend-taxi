import { USER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../request-auth";

export const getByIdUser = (userId: number) => {
  return request.get(`${USER_ROUTER}/${userId}`);
};
