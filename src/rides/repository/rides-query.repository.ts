import { Filter, ObjectId } from "mongodb";
import { rideCollection } from "../../db/collections";
import { Ride } from "../types/rides.types";
import { RideQueryInput } from "../dto/ride-query.input.dto";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapRideDataView, mapRideView } from "../mappers/ride-view";
import { RideDataView, RideMetaView } from "../types/rides-view.types";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";

export const ridesQueryRepository = {
  async getAll(queryDto: RideQueryInput): Promise<RideMetaView> {
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
    const rides = items.map(mapRideView);

    return mapDataPaginatedView(rides, {
      pageNumber: queryDto.pageNumber,
      pageSize: queryDto.pageSize,
      totalCount,
    });
  },

  async findByIdOrFail(id: string): Promise<RideDataView> {
    const ride = await rideCollection.findOne({ _id: new ObjectId(id) });
    if (!ride) {
      throw new Error(`ride by id=${id} not found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "id",
        },
      });
    }
    return mapRideDataView(ride);
  },
};
