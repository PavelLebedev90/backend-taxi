import { USER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../request-auth";

export const getByIdUser = (userId: string) => {
  return request.get(`${USER_ROUTER}/${userId}`);
};
