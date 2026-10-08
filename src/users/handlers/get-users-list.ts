import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserQueryInput } from "../dto/user-query.input.dto";
import { UserMetaView } from "../types/user-view.types";
import { usersQueryRepository } from "../repository/users-query.repository";

export const getUsersList = async (
  req: Request,
  res: Response<UserMetaView, { query: UserQueryInput }>,
) => {
  const dataWithMeta = await usersQueryRepository.getAll(res.locals.query);
  res.status(HttpStatus.Ok).send(dataWithMeta);
};
