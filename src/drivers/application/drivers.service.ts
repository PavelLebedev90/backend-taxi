import { ObjectId } from "mongodb";
import { driversRepository } from "../repository/drivers.repository";
import { Driver } from "../types/driver.types";
import { HttpStatus } from "../../core/types/http-statuses";
import { ridesService } from "../../rides/application/rides.service";

export const driversService = {
  async create(driver: Driver): Promise<ObjectId> {
    const { insertedId } = await driversRepository.create(driver);
    return insertedId;
  },

  async update(id: string, dto: Omit<Driver, "createdAt">): Promise<void> {
    const isUpdated = await driversRepository.update(id, dto);
    if (!isUpdated) {
      throw new Error(`not found Driver by id=${id}`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "id",
        },
      });
    }
  },

  async delete(id: string): Promise<void> {
    const activeRide = await ridesService.findActiveRideByDriverId(id);

    if (activeRide) {
      throw new Error(
        "Driver has an active ride. Complete or cancel the ride first",
        {
          cause: {
            status: HttpStatus.BadRequest,
            field: "id",
          },
        },
      );
    }

    const isDeleted = await driversRepository.delete(id);
    if (!isDeleted) {
      throw new Error(`not found Driver by id=${id}`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "id",
        },
      });
    }
    return;
  },
};
