import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { HttpStatus } from "../../core/types/http-statuses";
import { AuthLoginInput } from "../dto/user.input.dto";
import { usersService } from "../../users/application/users.service";

export const authService = {
  async loginAuth(loginInfo: AuthLoginInput): Promise<ObjectId> {
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
    return user._id;
  },
};
