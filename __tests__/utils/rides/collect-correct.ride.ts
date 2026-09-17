import { RideInputDto } from "../../../src/rides/dto/ride.input.dto";
import { Currency } from "../../../src/rides/types/rides.types";

export const collectCorrectRide = (driverId: number): RideInputDto => {
  return {
    driverId,
    clientName: "John",
    price: 100,
    currency: Currency.EUR,
    fromAddress: "123 Main St, Springfield, IL",
    toAddress: "456 Elm St, Shelbyville, IL",
  };
};
