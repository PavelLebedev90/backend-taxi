import { RideInputDto } from "../dto/ride.input.dto";
import { Ride } from "../types/rides.types";
import { DriverDataView } from "../../drivers/types/driver-view.types";

export function mapRideInputToDTO(
  dto: RideInputDto,
  driver: DriverDataView,
): Omit<Ride, "createdAt" | "finishedAt" | "startedAt" | "updatedAt"> {
  return {
    clientName: dto.clientName,
    addresses: {
      from: dto.fromAddress,
      to: dto.toAddress,
    },
    driver: {
      id: driver.data.id,
      name: driver.data.attributes.name,
    },
    currency: dto.currency,
    price: dto.price,
    vehicle: {
      licensePlate: driver.data.attributes.vehicle.licensePlate,
      name: `${driver.data.attributes.vehicle.make} ${driver.data.attributes.vehicle.model}`,
    },
  };
}
