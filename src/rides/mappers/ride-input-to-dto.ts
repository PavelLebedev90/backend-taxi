import { WithId } from "mongodb";
import { RideInputDto } from "../dto/ride.input.dto";
import { Ride } from "../types/rides.types";
import { Driver } from "../../drivers/types/driver.types";

export function mapRideInputToDTO(
  dto: RideInputDto,
  driver: WithId<Driver>,
): Omit<Ride, "createdAt" | "finishedAt" | "startedAt" | "updatedAt"> {
  return {
    clientName: dto.clientName,
    addresses: {
      from: dto.fromAddress,
      to: dto.toAddress,
    },
    driver: {
      id: driver._id.toString(),
      name: driver.name,
    },
    currency: dto.currency,
    price: dto.price,
    vehicle: {
      licensePlate: driver.vehicle.licensePlate,
      name: `${driver.vehicle.make} ${driver.vehicle.model}`,
    },
  };
}
