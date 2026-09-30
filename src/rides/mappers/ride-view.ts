import { WithId } from "mongodb";
import { Ride } from "../types/rides.types";
import { RideDataView, RideView } from "../types/rides-view.types";
import { ResourceType } from "../../core/types/resource";

export const mapRideView = (ride: WithId<Ride>): RideView => {
  return {
    id: ride._id.toString(),
    type: ResourceType.Rides,
    attributes: {
      addresses: ride.addresses,
      clientName: ride.clientName,
      currency: ride.currency,
      driver: ride.driver,
      price: ride.price,
      finishedAt: ride.finishedAt,
      startedAt: ride.startedAt,
      vehicle: ride.vehicle,
    },
  };
};

export function mapRideDataView(ride: WithId<Ride>): RideDataView {
  return {
    data: mapRideView(ride),
  };
}
