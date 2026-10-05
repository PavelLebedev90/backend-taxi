import { ObjectId } from "mongodb";
import { driverCollection } from "../../db/collections";
import { Driver } from "../types/driver.types";

export const driversRepository = {
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
