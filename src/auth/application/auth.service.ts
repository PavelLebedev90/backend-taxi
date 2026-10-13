import bcrypt from "bcrypt";
import { HttpStatus } from "../../core/types/http-statuses";
import { AuthLoginInput } from "../dto/user.input.dto";
import { usersService } from "../../users/application/users.service";
import { JWTService } from "../../core/application/jwt.service";
import { UserInputDto } from "../../users/dto/user.input.dto";
import { usersRepository } from "../../users/repository/users.repository";
import { mapUserInputToDTO } from "../../users/mappers/user-input-to-dto";
import { nodemailerService } from "../../core/application/nodemailer.service";
import { ObjectId } from "mongodb";
import { mapAuthEmailConfirmationToDb } from "../mappers/auth-email-confirmation-db";

export const authService = {
  async loginAuth(loginInfo: AuthLoginInput): Promise<{ token: string }> {
    const user = await usersService.findUserByLoginOrEmail(
      loginInfo.loginOrEmail,
    );
    if (!user) {
      throw new Error(
        `not found Auth by loginOrEmail=${loginInfo.loginOrEmail}`,
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
    const token = JWTService.createToken(user);
    return token;
  },
  async registrationAuth(userInfo: UserInputDto): Promise<ObjectId> {
    const existingUser = await usersService.findUserByLoginOrEmail({
      email: userInfo.email,
      login: userInfo.login,
    });
    if (existingUser) {
      throw new Error(`User with login or email already exists`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "loginOrEmail",
        },
      });
    }
    const passwordHash = await bcrypt.hash(userInfo.password, 10);
    const user = {
      ...mapUserInputToDTO(userInfo),
      ...mapAuthEmailConfirmationToDb(),
      createdAt: new Date(),
      passwordHash,
      login: userInfo.login,
    };
    const { insertedId } = await usersRepository.create(user);

    nodemailerService
      .sendWelcome(user.email, user.fullName, user.emailConfirmationCode)
      .catch((e) => {
        throw new Error(`nodemailer service is Dead`, {
          cause: {
            status: HttpStatus.InternalServerError,
            field: "nodemailer",
          },
        });
      });

    return insertedId;
  },
  async registrationConfirmationAuth(
    emailConfirmationCode: string,
  ): Promise<boolean> {
    const user = await usersService.findUserByEmailConfirmationCode(
      emailConfirmationCode,
    );
    if (!user) {
      throw new Error(`User with emailConfirmationCode not Found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "emailConfirmationCode",
        },
      });
    }
    if (
      user.emailConfirmationExpirationDate &&
      user.emailConfirmationExpirationDate.getTime() < new Date().getTime()
    ) {
      throw new Error(`EmailConfirmationCode is expired`, {
        cause: {
          status: HttpStatus.BadRequest,
          field: "emailConfirmationExpirationDate",
        },
      });
    }

    const isUpdated = await usersRepository.update(user._id.toString(), {
      ...user,
      emailConfirmationCode: null,
      emailConfirmationExpirationDate: null,
      emailConfirmationIsConfirmed: true,
    });

    return isUpdated;
  },
  async registrationEmailResendingAuth(email: string): Promise<boolean> {
    const user = await usersService.findUserByLoginOrEmail(email);
    if (!user) {
      throw new Error(`User with email=${email} not Found`, {
        cause: {
          status: HttpStatus.NotFound,
          field: "email",
        },
      });
    }
    if (
      user.emailConfirmationExpirationDate &&
      user.emailConfirmationExpirationDate.getTime() > new Date().getTime()
    ) {
      throw new Error(
        `EmailConfirmationCode for email=${email} is not expired`,
        {
          cause: {
            status: HttpStatus.BadRequest,
            field: "email",
          },
        },
      );
    }

    const updateUserInfo = {
      ...user,
      ...mapAuthEmailConfirmationToDb(),
    };

    const isUpdated = await usersRepository.update(
      user._id.toString(),
      updateUserInfo,
    );

    nodemailerService
      .sendWelcome(
        updateUserInfo.email,
        updateUserInfo.fullName,
        updateUserInfo.emailConfirmationCode,
      )
      .catch((e) => {
        throw new Error(`nodemailer service is Dead`, {
          cause: {
            status: HttpStatus.InternalServerError,
            field: "nodemailer",
          },
        });
      });

    return isUpdated;
  },
};
