import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { usersRepository } from "../repository/users.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserInputDto } from "../dto/user.input.dto";
import { mapUserInputToDTO } from "../mappers/user-input-to-dto";

export const usersService = {
  async findById(id: string) {
    return await usersRepository.findById(id);
  },
  async findUserByLoginOrEmail(
    loginOrEmail: string | { login: string; email: string },
  ) {
    return await usersRepository.findUserByLoginOrEmail(loginOrEmail);
  },
  async findUserByEmailConfirmationCode(code: string) {
    return await usersRepository.findUserByEmailConfirmationCode(code);
  },
  async create(user: UserInputDto): Promise<ObjectId> {
    const existingUser = await this.findUserByLoginOrEmail({
      email: user.email,
      login: user.login,
    });
    if (existingUser) {
      throw new Error(`User with email or login already exists`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "loginOrEmail",
        },
      });
    }
    const passwordHash = await bcrypt.hash(user.password, 10);
    const { insertedId } = await usersRepository.create({
      ...mapUserInputToDTO(user),
      createdAt: new Date(),
      passwordHash,
      login: user.login,
      emailConfirmationCode: null,
      emailConfirmationExpirationDate: null,
      emailConfirmationIsConfirmed: true,
    });
    return insertedId;
  },
  async update(
    id: string,
    user: Omit<UserInputDto, "login" | "password">,
  ): Promise<void> {
    const isUpdated = await usersRepository.update(id, mapUserInputToDTO(user));
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
