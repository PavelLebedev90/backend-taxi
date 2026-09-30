import { WithId } from "mongodb";
import { Driver } from "../types/driver.types";
import { DriverDataView, DriverView } from "../types/driver-view.types";
import { ResourceType } from "../../core/types/resource";

export const mapDriverView = (driver: WithId<Driver>): DriverView => {
  return {
    type: ResourceType.Drivers,
    id: driver._id.toString(),
    attributes: {
      name: driver.name,
      phoneNumber: driver.phoneNumber,
      email: driver.email,
      vehicle: driver.vehicle,
      createdAt: driver.createdAt,
    },
  };
};

export function mapDriverDataView(ride: WithId<Driver>): DriverDataView {
  return {
    data: mapDriverView(ride),
  };
}
