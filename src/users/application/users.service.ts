import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { usersRepository } from "../repository/users.repository";
import { User } from "../types/user.types";
import { HttpStatus } from "../../core/types/http-statuses";

export const usersService = {
  async findById(id: string) {
    return await usersRepository.findById(id);
  },
  async findUserByLoginOrEmail(loginOrEmail: string) {
    return await usersRepository.findUserByLoginOrEmail(loginOrEmail);
  },
  async create(
    user: Omit<User, "passwordHash"> & { password: string },
  ): Promise<ObjectId> {
    const existingUser = await this.findUserByLoginOrEmail(user.email);
    if (existingUser) {
      throw new Error(`User with email=${user.email} already exists`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "email",
        },
      });
    }
    const passwordHash = await bcrypt.hash(user.password, 10);
    const { insertedId } = await usersRepository.create({
      ...user,
      passwordHash: passwordHash,
    });
    return insertedId;
  },
  async update(
    id: string,
    dto: Omit<User, "createdAt" | "passwordHash" | "login">,
  ): Promise<void> {
    const isUpdated = await usersRepository.update(id, dto);
    if (!isUpdated) {
      throw new Error(`not found User by id=${id}`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "id",
        },
      });
    }
  },

  async delete(id: string): Promise<void> {
    const isDeleted = await usersRepository.delete(id);
    if (!isDeleted) {
      throw new Error(`not found User by id=${id}`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "id",
        },
      });
    }
    return;
  },
};
