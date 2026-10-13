import { ObjectId } from "mongodb";
import { userCollection } from "../../db/collections";
import { User, UserDto } from "../types/user.types";

export const usersRepository = {
  async findById(id: string) {
    return await userCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(bodyUser: User) {
    return await userCollection.insertOne(bodyUser);
  },
  async findUserByLoginOrEmail(
    loginOrEmail: string | { login: string; email: string },
  ) {
    let login = loginOrEmail;
    let email = loginOrEmail;

    if (typeof loginOrEmail === "object") {
      login = loginOrEmail.login;
      email = loginOrEmail.email;
    }
    return await userCollection.findOne({
      $or: [{ login: login }, { email: email }],
    });
  },
  async findUserByEmailConfirmationCode(code: string) {
    return await userCollection.findOne({
      emailConfirmationCode: code,
    });
  },
  async update(
    paramId: string,
    bodyUser: Omit<User, "login" | "passwordHash" | "createdDate"> | UserDto,
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
