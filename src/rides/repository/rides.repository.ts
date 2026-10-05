import { ObjectId } from "mongodb";
import { rideCollection } from "../../db/collections";
import { Ride } from "../types/rides.types";

export const ridesRepository = {
  async findActiveRideByDriverId(id: string) {
    return await rideCollection.findOne({ "driver.id": id, finishedAt: null });
  },
  async create(bodyRide: Ride) {
    return await rideCollection.insertOne(bodyRide);
  },
  async finishRide(id: string, finishedAt: Date) {
    const updatedRide = await rideCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          finishedAt,
          updatedAt: new Date(),
        },
      },
    );
    return updatedRide.matchedCount === 1;
  },
  async update(_paramId: number, _bodyDriver: unknown) {},
  async delete(_paramId: number) {},
};
