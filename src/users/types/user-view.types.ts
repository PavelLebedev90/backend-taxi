import { PaginatedView } from "../../core/types/queries";
import { ResourceType } from "../../core/types/resource";

export type UserView = {
  type: ResourceType.Users;
  id: string;
  attributes: {
    firstName: string;
    lastName: string;
    middleName: string | null;
    phoneNumber: string;
    email: string;
    createdAt: Date;
  };
};

export type UserDataView = {
  data: UserView;
};

export type UserMetaView = {
  meta: PaginatedView;
  data: UserView[];
};
