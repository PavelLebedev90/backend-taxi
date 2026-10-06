import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { usersRepository } from "../repository/users.repository";
import { User } from "../types/user.types";
import { HttpStatus } from "../../core/types/http-statuses";
import { ridesService } from "../../rides/application/rides.service";
import { UserLoginInput } from "../dto/user.input.dto";

export const usersService = {
  async findById(id: string) {
    return await usersRepository.findById(id);
  },
  async create(
    user: Omit<User, "passwordHash"> & { password: string },
  ): Promise<ObjectId> {
    const existingUser = await usersRepository.findUserByLoginOrEmail(
      user.email,
    );
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
  async loginUser(loginInfo: UserLoginInput): Promise<ObjectId> {
    const user = await usersRepository.findUserByLoginOrEmail(
      loginInfo.loginOrEmail,
    );
    if (!user) {
      throw new Error(
        `not found User by loginOrEmail=${loginInfo.loginOrEmail}`,
        {
          cause: {
            status: HttpStatus.NotFound,
            field: "loginOrEmail",
          },
        },
      );
    }
    const isPasswordValid = await bcrypt.compare(
      loginInfo.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new Error(
        `Invalid credentials for loginOrEmail=${loginInfo.loginOrEmail}`,
        {
          cause: {
            status: HttpStatus.Unauthorized,
            field: "loginOrEmail",
          },
        },
      );
    }
    return user._id;
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
    const activeRide = await ridesService.findActiveRideByDriverId(id);

    if (activeRide) {
      throw new Error(
        "User has an active ride. Complete or cancel the ride first",
        {
          cause: {
            status: HttpStatus.BadRequest,
            field: "id",
          },
        },
      );
    }

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
