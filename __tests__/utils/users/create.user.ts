import { USER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../request-auth";
import { UserCreateInput } from "../../../src/users/dto/user.input.dto";

type UserInputTestDto = {
  [K in keyof UserCreateInput]?: any;
};

export const createUser = (newUser: UserInputTestDto) => {
  return request.post(USER_ROUTER).send(newUser);
};
