import { ResourceType } from "../../core/types/resource";
import { VehicleFeature } from "../types/driver.types";

export type DriverInputDto = {
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};

export type DriverCreateInput = {
  data: {
    type: ResourceType.Drivers;
    attributes: DriverInputDto;
  };
};

export type DriverUpdateInput = {
  data: {
    type: ResourceType.Drivers;
    id: string;
    attributes: DriverInputDto;
  };
};
