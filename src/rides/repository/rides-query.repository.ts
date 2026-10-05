import { Filter, ObjectId, WithId } from "mongodb";
import { rideCollection } from "../../db/collections";
import { Ride } from "../types/rides.types";
import { RideQueryInput } from "../dto/ride-query.input.dto";
import { HttpStatus } from "../../core/types/http-statuses";

export const ridesQueryRepository = {
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
  async findByIdOrFail(id: string): Promise<WithId<Ride>> {
    const ride = await this.findById(id);
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
};
