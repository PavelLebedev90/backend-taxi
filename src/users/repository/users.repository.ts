import { ObjectId } from "mongodb";
import { userCollection } from "../../db/collections";
import { User } from "../types/user.types";

export const usersRepository = {
  async findById(id: string) {
    return await userCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(bodyUser: User) {
    return await userCollection.insertOne(bodyUser);
  },
  async findUserByLoginOrEmail(loginOrEmail: string) {
    return await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },
  async update(
    paramId: string,
    bodyUser: Omit<User, "createdAt" | "passwordHash" | "login">,
  ) {
    const updatedUser = await userCollection.updateOne(
      { _id: new ObjectId(paramId) },
      { $set: bodyUser },
    );
    return updatedUser.matchedCount === 1;
  },
  async delete(paramId: string) {
    const isDeleted = await userCollection.deleteOne({
      _id: new ObjectId(paramId),
    });
    return isDeleted.deletedCount === 1;
  },
};
