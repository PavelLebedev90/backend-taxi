import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";
import { UserQueryInput } from "../dto/user-query.input.dto";
import { UserMetaView } from "../types/user-view.types";
import { usersQueryRepository } from "../repository/users-query.repository";
import { mapUserView } from "../mappers/user-view";

export const getUsersList = async (
  req: Request,
  res: Response<UserMetaView, { query: UserQueryInput }>,
) => {
  const { items, totalCount } = await usersQueryRepository.getAll(
    res.locals.query,
  );
  const users = items.map(mapUserView);
  res.status(HttpStatus.Ok).send(
    mapDataPaginatedView(users, {
      pageNumber: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount,
    }),
  );
};
