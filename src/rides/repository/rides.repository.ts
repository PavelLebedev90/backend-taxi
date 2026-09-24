import { ObjectId } from "mongodb";
import { rideCollection } from "../../db/collections";
import { Ride } from "../types/rides.types";

export const ridesRepository = {
  async getAll() {
    return await rideCollection.find().toArray();
  },
  async findById(id: string) {
    return await rideCollection.findOne({ _id: new ObjectId(id) });
  },
  async findActiveRideByDriverId(id: string) {
    return await rideCollection.findOne({ "driver.id": id, finishedAt: null });
  },
  async create(bodyRide: Ride) {
    const createdRide = await rideCollection.insertOne(bodyRide);
    const ride = await rideCollection.findOne({ _id: createdRide.insertedId });
    return ride;
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
