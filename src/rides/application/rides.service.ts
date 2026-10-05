import { ObjectId, WithId } from "mongodb";
import { ridesRepository } from "../../rides/repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { Ride } from "../types/rides.types";

export const ridesService = {
  async create(ride: Ride): Promise<ObjectId> {
    const activeRide = await this.findActiveRideByDriverId(ride.driver.id);

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

  async finishRide(
    id: string,
    finishedAt: Date,
    ride: WithId<Ride>,
  ): Promise<void> {
    if (ride?.finishedAt) {
      throw new Error(`Ride already finished`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "id",
        },
      });
    }
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
