import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { usersService } from "../application/users.service";

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  await usersService.delete(req.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
