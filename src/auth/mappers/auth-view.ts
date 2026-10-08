import { WithId } from "mongodb";
import { ResourceType } from "../../core/types/resource";
import { User } from "../../users/types/user.types";
import { UserView } from "../../users/types/user-view.types";

export const mapAuthView = (user: WithId<User>): UserView => {
  return {
    type: ResourceType.Users,
    id: user._id.toString(),
    attributes: {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
};
