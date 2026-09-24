import { ObjectId } from "mongodb";
import { driverCollection } from "../../db/collections";
import { Driver } from "../types/driver.types";

export const driversRepository = {
  async getAll() {
    return await driverCollection.find().toArray();
  },
  async findById(id: string) {
    return await driverCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(bodyDriver: Driver) {
    const createdDriver = await driverCollection.insertOne(bodyDriver);
    const driver = await driversRepository.findById(
      createdDriver.insertedId.toString(),
    );
    return driver;
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
