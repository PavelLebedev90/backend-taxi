import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { VehicleFeature } from "../../../src/drivers/types/driver.types";

export const collectCorrectDriver = (): DriverInputDto => {
  return {
    name: "Valentin",
    phoneNumber: "12345678",
    email: "valentin@example.com",
    vehicleMake: "BMW1",
    vehicleModel: "X52",
    vehicleYear: 2021,
    vehicleLicensePlate: "ABC-123",
    vehicleDescription: null,
    vehicleFeatures: [VehicleFeature.WiFi],
  };
};
