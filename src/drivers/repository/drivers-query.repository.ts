import { Filter, ObjectId } from "mongodb";
import { driverCollection } from "../../db/collections";
import { Driver } from "../types/driver.types";
import { DriverQueryInput } from "../dto/driver-query.input.dto";
import { HttpStatus } from "../../core/types/http-statuses";
import { DriverDataView, DriverMetaView } from "../types/driver-view.types";
import { mapDriverDataView, mapDriverView } from "../mappers/driver-view";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";

export const driversQueryRepository = {
  async getAll(queryDto: DriverQueryInput): Promise<DriverMetaView> {
    const filters: Filter<Driver> = {};
    const skip = (queryDto.pageNumber - 1) * queryDto.pageSize;
    const filterFields = {
      email: queryDto.searchDriverEmailTerm,
      name: queryDto.searchDriverNameTerm,
    };
    Object.entries(filterFields).forEach(([key, value]) => {
      if (value) {
        if (!filters.$or) {
          filters.$or = [];
        }
        filters.$or.push({
          key: { $regex: value, $options: "i" },
        });
      }
    });

    if (queryDto.searchVehicleMakeTerm) {
      filters["vehicle.make"] = {
        $regex: queryDto.searchVehicleMakeTerm,
        $options: "i",
      };
    }
    const [items, totalCount] = await Promise.all([
      driverCollection
        .find(filters)
        .sort(queryDto.sortBy, queryDto.sortDirection)
        .skip(skip)
        .limit(queryDto.pageSize)
        .toArray(),
      driverCollection.countDocuments(filters),
    ]);
    const drivers = items.map(mapDriverView);
    return mapDataPaginatedView(drivers, {
      pageNumber: queryDto.pageNumber,
      pageSize: queryDto.pageSize,
      totalCount,
    });
  },
  async findByIdOrFail(id: string): Promise<DriverDataView> {
    const driver = await driverCollection.findOne({ _id: new ObjectId(id) });
    if (!driver) {
      throw new Error(`driver by id=${id} not found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "id",
        },
      });
    }
    return mapDriverDataView(driver);
  },
};
