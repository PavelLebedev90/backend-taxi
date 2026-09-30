import { ObjectId, WithId } from "mongodb";
import { driversRepository } from "../repository/drivers.repository";
import { Driver } from "../types/driver.types";
import { DriverQueryInput } from "../dto/driver-query.input.dto";
import { ridesRepository } from "../../rides/repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";

export const driversService = {
  async getAll(
    queryDto: DriverQueryInput,
  ): Promise<{ items: WithId<Driver>[]; totalCount: number }> {
    return await driversRepository.getAll(queryDto);
  },

  async findById(id: string): Promise<WithId<Driver> | null> {
    return await driversRepository.findById(id);
  },
  async findByIdOrFail(id: string): Promise<WithId<Driver>> {
    const driver = await driversRepository.findById(id);
    if (!driver) {
      throw new Error(`driver by id=${id} not found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "id",
        },
      });
    }
    return driver;
  },

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
    const activeRide = await ridesRepository.findActiveRideByDriverId(id);

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
