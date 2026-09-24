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
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  vehicle: Vehicle;
  createdAt: Date;
};
