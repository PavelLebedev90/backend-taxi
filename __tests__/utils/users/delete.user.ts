import { USER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../request-auth";

export const deleteUser = (userId: string) => {
  return request.delete(`${USER_ROUTER}/${userId}`);
};
