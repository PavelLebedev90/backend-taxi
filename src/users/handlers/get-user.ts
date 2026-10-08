import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserDataView } from "../types/user-view.types";
import { usersQueryRepository } from "../repository/users-query.repository";

export const getUser = async (
  req: Request<{ id: string }>,
  res: Response<UserDataView>,
) => {
  const user = await usersQueryRepository.findByIdOrFail(req.params.id);
  res.status(HttpStatus.Ok).send(user);
};
