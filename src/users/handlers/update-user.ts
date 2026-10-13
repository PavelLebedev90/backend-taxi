import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserUpdateInput } from "../dto/user.input.dto";
import { usersService } from "../application/users.service";

export const updateUser = async (
  req: Request<{ id: string }, unknown, UserUpdateInput>,
  res: Response,
) => {
  await usersService.update(req.params.id, req.body.data.attributes);
  res.sendStatus(HttpStatus.NoContent);
};
