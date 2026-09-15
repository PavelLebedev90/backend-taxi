import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Driver } from "../types/driver";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";
import { driversRepository } from "../repository/drivers.repository";

export const updateDriver = (
  req: Request<{ id: string }, unknown, Driver>,
  res: Response,
) => {
  const validationErrors = validateDriverInputDto(req.body);
  if (validationErrors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorMessages: validationErrors });
    return;
  }
  const isUpdated = driversRepository.update(+req.params.id, req.body);
  if (!isUpdated) {
    res.status(HttpStatus.BadRequest).send({
      errorMessages: [
        { field: "id", message: `not found Driver by id=${req.body.id}` },
      ],
    });
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
};
