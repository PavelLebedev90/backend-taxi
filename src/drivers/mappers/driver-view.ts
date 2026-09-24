import { WithId } from "mongodb";
import { Driver } from "../types/driver.types";
import { DriverView } from "../types/driver-view.types";

export const mapDriverView = (driver: WithId<Driver>): DriverView => {
  return {
    id: driver._id.toString(),
    name: driver.name,
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    vehicle: driver.vehicle,
    createdAt: driver.createdAt,
  };
};
