import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UserUpdateInput } from "../dto/user.input.dto";
import { usersService } from "../application/users.service";
import { mapUserInputToDTO } from "../mappers/user-input-to-dto";

export const updateUser = async (
  req: Request<{ id: string }, unknown, UserUpdateInput>,
  res: Response,
) => {
  await usersService.update(
    req.params.id,
    mapUserInputToDTO(req.body.data.attributes),
  );
  res.sendStatus(HttpStatus.NoContent);
};
