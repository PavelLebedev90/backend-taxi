import { WithId } from "mongodb";
import { ResourceType } from "../../core/types/resource";
import { User } from "../types/user.types";
import { UserDataView, UserView } from "../types/user-view.types";

export const mapUserView = (user: WithId<User>): UserView => {
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

export function mapUserDataView(user: WithId<User>): UserDataView {
  return {
    data: mapUserView(user),
  };
}
