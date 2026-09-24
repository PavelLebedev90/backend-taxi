import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repository/drivers.repository";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";
import { mapDriverInputToDTO } from "../mappers/driver-input-to-dto";
import { DriverInputDto } from "../dto/driver.input.dto";

export const updateDriver = async (
  req: Request<{ id: string }, unknown, DriverInputDto>,
  res: Response,
) => {
  const isUpdated = await driversRepository.update(
    req.params.id,
    mapDriverInputToDTO(req.body),
  );
  if (!isUpdated) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        errorMessagesFormatter([
          { field: "id", message: `not found Driver by id=${req.params.id}` },
        ]),
      );
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
};
