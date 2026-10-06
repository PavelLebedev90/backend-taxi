import { USER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { UserUpdateInput } from "../../../src/users/dto/user.input.dto";

export const updateUser = (userId: string, updatedUser: UserUpdateInput) => {
  return request.put(`${USER_ROUTER}/${userId}`).send(updatedUser);
};
