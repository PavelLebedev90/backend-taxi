import { DriverInputDto } from "../dto/driver.input.dto";
import { Driver } from "../types/driver.types";

export function mapDriverInputToDTO(
  dto: DriverInputDto,
): Omit<Driver, "createdAt"> {
  return {
    name: dto.name,
    phoneNumber: dto.phoneNumber,
    email: dto.email,
    vehicle: {
      make: dto.vehicleMake,
      model: dto.vehicleModel,
      year: dto.vehicleYear,
      licensePlate: dto.vehicleLicensePlate,
      description: dto.vehicleDescription,
      features: dto.vehicleFeatures,
    },
  };
}
