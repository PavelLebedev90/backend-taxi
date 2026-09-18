import { db } from "../../db/data-base";
import { DriverInputDto } from "../dto/driver.input.dto";
import { Driver } from "../types/driver.types";

export const driversRepository = {
  getAll() {
    return db.drivers;
  },
  findById(id: number) {
    return db.drivers.find((d) => d.id === id) ?? null;
  },
  create(bodyDriver: DriverInputDto) {
    const lastDriver = db.drivers[db.drivers.length - 1];
    const newDriver: Driver = {
      id: lastDriver ? lastDriver.id + 1 : 1,
      name: bodyDriver.name,
      phoneNumber: bodyDriver.phoneNumber,
      email: bodyDriver.email,
      vehicleMake: bodyDriver.vehicleMake,
      vehicleModel: bodyDriver.vehicleModel,
      vehicleYear: bodyDriver.vehicleYear,
      vehicleLicensePlate: bodyDriver.vehicleLicensePlate,
      vehicleDescription: bodyDriver.vehicleDescription,
      vehicleFeatures: bodyDriver.vehicleFeatures,
      createdAt: new Date(),
    };

    db.drivers.push(newDriver);
    return newDriver;
  },
  update(paramId: number, bodyDriver: DriverInputDto) {
    const newDriver: DriverInputDto = {
      name: bodyDriver.name,
      phoneNumber: bodyDriver.phoneNumber,
      email: bodyDriver.email,
      vehicleMake: bodyDriver.vehicleMake,
      vehicleModel: bodyDriver.vehicleModel,
      vehicleYear: bodyDriver.vehicleYear,
      vehicleLicensePlate: bodyDriver.vehicleLicensePlate,
      vehicleDescription: bodyDriver.vehicleDescription,
      vehicleFeatures: bodyDriver.vehicleFeatures,
    };

    const updatedDriverIdx = db.drivers.findIndex(
      (driver) => driver.id === paramId,
    );
    if (updatedDriverIdx < 0) {
      return false;
    }

    db.drivers[updatedDriverIdx] = {
      ...db.drivers[updatedDriverIdx],
      ...newDriver,
    };
    return true;
  },
  delete(paramId: number) {
    const deletedDriverIdx = db.drivers.findIndex(
      (driver) => driver.id === paramId,
    );
    if (deletedDriverIdx < 0) {
      return false;
    }
    db.drivers.splice(deletedDriverIdx, 1);
    return true;
  },
};
