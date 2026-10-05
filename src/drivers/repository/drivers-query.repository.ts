import { Filter, ObjectId, WithId } from "mongodb";
import { driverCollection } from "../../db/collections";
import { Driver } from "../types/driver.types";
import { DriverQueryInput } from "../dto/driver-query.input.dto";
import { HttpStatus } from "../../core/types/http-statuses";

export const driversQueryRepository = {
  async getAll(queryDto: DriverQueryInput) {
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
    return { items, totalCount };
  },
  async findById(id: string) {
    return await driverCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByIdOrFail(id: string): Promise<WithId<Driver>> {
    const driver = await this.findById(id);
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
};
