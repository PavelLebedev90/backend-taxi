import { PaginatedView } from "../../core/types/queries";
import { ResourceType } from "../../core/types/resource";
import { VehicleFeature } from "./driver.types";

type Vehicle = {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  description: string | null;
  features: VehicleFeature[];
};

export type DriverView = {
  type: ResourceType.Drivers;
  id: string;
  attributes: {
    name: string;
    phoneNumber: string;
    email: string;
    vehicle: Vehicle;
    createdAt: Date;
  };
};

export type DriverDataView = {
  data: DriverView;
};

export type DriverMetaView = {
  meta: PaginatedView;
  data: DriverView[];
};
