import { ResourceType } from "../../core/types/resource";

export type UserInputDto = {
  login: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phoneNumber: string;
};

export type UserCreateInput = {
  data: {
    type: ResourceType.Users;
    attributes: UserInputDto;
  };
};

export type UserUpdateInput = {
  data: {
    type: ResourceType.Users;
    id: string;
    attributes: Omit<UserInputDto, "login" | "password">;
  };
};

export type UserLoginInput = {
  loginOrEmail: string;
  password: string;
};
