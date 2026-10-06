import { ResourceType } from "../../../src/core/types/resource";
import { UserCreateInput } from "../../../src/users/dto/user.input.dto";

export const collectCorrectUser = (): UserCreateInput => {
  return {
    data: {
      type: ResourceType.Users,
      attributes: {
        email: "johndoe@example.com",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+12025550123",
        password: "securePass1",
        login: "johndoe",
        middleName: "Mi",
      },
    },
  };
};
