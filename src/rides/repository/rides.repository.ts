import { Filter, ObjectId } from "mongodb";
import { rideCollection } from "../../db/collections";
import { Ride } from "../types/rides.types";
import { RideQueryInput } from "../dto/ride-query.input.dto";

export const ridesRepository = {
  async getAll(queryDto: RideQueryInput) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const filters: Filter<Ride> = {};
    const skip = (pageNumber - 1) * pageSize;
    const [items, totalCount] = await Promise.all([
      rideCollection
        .find(filters)
        .sort(sortBy, sortDirection)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      rideCollection.countDocuments(filters),
    ]);
    return { items, totalCount };
  },
  async findById(id: string) {
    return await rideCollection.findOne({ _id: new ObjectId(id) });
  },
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
