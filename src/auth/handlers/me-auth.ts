import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserDataView, UserView } from "../../users/types/user-view.types";
import { usersQueryRepository } from "../../users/repository/users-query.repository";

export const getMeAuth = async (
  _req: Request,
  res: Response<
    UserDataView,
    {
      user: UserView;
    }
  >,
) => {
  const user = await usersQueryRepository.findByIdOrFail(res.locals?.user?.id);
  res.status(HttpStatus.Ok).send(user);
};
