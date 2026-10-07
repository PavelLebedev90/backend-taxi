import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserView } from "../../users/types/user-view.types";
import { WithId } from "mongodb";
import { User } from "../../users/types/user.types";
import { mapUserView } from "../../users/mappers/user-view";

export const getMeAuth = async (
  _req: Request,
  res: Response<
    UserView,
    {
      user: WithId<User>;
    }
  >,
) => {
  // const user = await usersQueryRepository.findByIdOrFail(
  //   res.locals?.user._id.toString(),
  // );
  if (!res.locals.user) {
    throw new Error(`not found Auth credentials`, {
      cause: {
        status: HttpStatus.Unauthorized,
        field: "user",
      },
    });
  }
  res.status(HttpStatus.Ok).send(mapUserView(res.locals.user));
};
