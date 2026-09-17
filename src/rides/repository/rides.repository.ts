import { db } from "../../db/data-base";
import { Driver } from "../../drivers/types/driver.types";
import { RideInputDto } from "../dto/ride.input.dto";
import { Ride } from "../types/rides.types";

export const ridesRepository = {
  getAll() {
    return db.rides;
  },
  findById(id: number) {
    return db.rides.find((d) => d.id === id) ?? null;
  },
  create(bodyRide: RideInputDto, driver: Driver) {
    const lastRide = db.rides[db.rides.length - 1];
    const newRide: Ride = {
      id: lastRide ? lastRide.id + 1 : 1,
      vehicleName: `${driver.vehicleMake} ${driver.vehicleModel}`,
      price: bodyRide.price,
      addresses: {
        from: bodyRide.fromAddress,
        to: bodyRide.toAddress,
      },
      clientName: bodyRide.clientName,
      driverId: driver.id,
      driverName: driver.name,
      currency: bodyRide.currency,
      updatedAt: null,
      vehicleLicensePlate: driver.vehicleLicensePlate,
      createdAt: new Date(),
    };

    db.rides.push(newRide);
    return newRide;
  },
  update(_paramId: number, _bodyDriver: unknown) {},
  delete(_paramId: number) {},
};
