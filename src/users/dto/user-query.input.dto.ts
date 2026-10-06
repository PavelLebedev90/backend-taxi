import { Queries } from "../../core/types/queries";

export enum UserSortFields {
  CreatedAt = "createdAt",
  FirstName = "firstName",
  Email = "email",
}

export type UserQueryInput = Queries<UserSortFields> & {
  searchUserFullNameTerm: string;
  searchUserEmailTerm: string;
};
