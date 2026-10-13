import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserCreateInput } from "../dto/user.input.dto";
import { usersService } from "../application/users.service";
import { UserDataView } from "../types/user-view.types";
import { usersQueryRepository } from "../repository/users-query.repository";

export const createUser = async (
  req: Request<unknown, unknown, UserCreateInput>,
  res: Response<UserDataView>,
) => {
  const createdUserId = await usersService.create(req.body.data.attributes);
  const user = await usersQueryRepository.findByIdOrFail(
    createdUserId.toString(),
  );
  res.status(HttpStatus.Created).send(user);
};
