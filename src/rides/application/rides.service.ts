import { ObjectId, WithId } from "mongodb";
import { RideQueryInput } from "../dto/ride-query.input.dto";
import { ridesRepository } from "../../rides/repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { Ride } from "../types/rides.types";

export const ridesService = {
  async getAll(
    queryDto: RideQueryInput,
  ): Promise<{ items: WithId<Ride>[]; totalCount: number }> {
    return await ridesRepository.getAll(queryDto);
  },

  async findById(id: string): Promise<WithId<Ride> | null> {
    return await ridesRepository.findById(id);
  },
  async findByIdOrFail(id: string): Promise<WithId<Ride>> {
    const ride = await ridesRepository.findById(id);
    if (!ride) {
      throw new Error(`ride by id=${id} not found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "id",
        },
      });
    }
    return ride;
  },

  async create(ride: Ride): Promise<ObjectId> {
    const activeRide = await ridesService.findActiveRideByDriverId(
      ride.driver.id,
    );

    if (activeRide) {
      throw new Error(
        `The driver with id=${ride.driver.id} is currently on a job`,
        {
          cause: {
            status: HttpStatus.BadRequest,
            field: "ride.driver.id",
          },
        },
      );
    }

    const { insertedId } = await ridesRepository.create(ride);
    return insertedId;
  },

  async finishRide(id: string, finishedAt: Date): Promise<void> {
    const isUpdated = await ridesRepository.finishRide(id, finishedAt);
    if (!isUpdated) {
      throw new Error(`not found Ride by id=${id}`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "id",
        },
      });
    }
  },
  async findActiveRideByDriverId(id: string): Promise<WithId<Ride> | null> {
    const activeRide = await ridesRepository.findActiveRideByDriverId(id);
    return activeRide;
  },
  async update(_paramId: number, _bodyDriver: unknown) {},
  async delete(_paramId: number) {},
};
