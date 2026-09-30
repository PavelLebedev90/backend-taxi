import { Filter, ObjectId } from "mongodb";
import { driverCollection } from "../../db/collections";
import { Driver } from "../types/driver.types";
import { DriverQueryInput } from "../dto/driver-query.input.dto";

export const driversRepository = {
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
  async create(bodyDriver: Driver) {
    return await driverCollection.insertOne(bodyDriver);
  },
  async update(paramId: string, bodyDriver: Omit<Driver, "createdAt">) {
    const updatedDriver = await driverCollection.updateOne(
      { _id: new ObjectId(paramId) },
      { $set: bodyDriver },
    );
    return updatedDriver.matchedCount === 1;
  },
  async delete(paramId: string) {
    const isDeleted = await driverCollection.deleteOne({
      _id: new ObjectId(paramId),
    });
    return isDeleted.deletedCount === 1;
  },
};
