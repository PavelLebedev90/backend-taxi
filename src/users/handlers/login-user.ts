import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserLoginInput } from "../dto/user.input.dto";
import { usersService } from "../application/users.service";
import { UserDataView } from "../types/user-view.types";
import { usersQueryRepository } from "../repository/users-query.repository";

export const loginUser = async (
  req: Request<unknown, unknown, UserLoginInput>,
  res: Response<UserDataView>,
) => {
  const userId = await usersService.loginUser(req.body);
  const user = await usersQueryRepository.findByIdOrFail(userId.toString());
  res.status(HttpStatus.Ok).send(user);
};
