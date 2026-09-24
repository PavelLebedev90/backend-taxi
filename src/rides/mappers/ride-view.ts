import { WithId } from "mongodb";
import { Ride } from "../types/rides.types";
import { RideView } from "../types/rides-view.types";

export const mapRideView = (ride: WithId<Ride>): RideView => {
  return {
    id: ride._id.toString(),
    addresses: ride.addresses,
    clientName: ride.clientName,
    currency: ride.currency,
    driver: ride.driver,
    price: ride.price,
    finishedAt: ride.finishedAt,
    startedAt: ride.startedAt,
    vehicle: ride.vehicle,
  };
};
