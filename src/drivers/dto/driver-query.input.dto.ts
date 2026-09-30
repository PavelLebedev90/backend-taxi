import { Queries } from "../../core/types/queries";

export enum DriverSortFields {
  CreatedAt = "createdAt",
  Name = "name",
  Email = "email",
}

export type DriverQueryInput = Queries<DriverSortFields> & {
  searchDriverNameTerm: string;
  searchDriverEmailTerm: string;
  searchVehicleMakeTerm: string;
};
