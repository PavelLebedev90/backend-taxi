import { USER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../request-auth";
import { UserLoginInput } from "../../../src/users/dto/user.input.dto";

type UserInputTestDto = {
  [K in keyof UserLoginInput]?: any;
};

export const loginUser = (loginUser: UserInputTestDto) => {
  return request.post(`${USER_ROUTER}/login`).send(loginUser);
};
