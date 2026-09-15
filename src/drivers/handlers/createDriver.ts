import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Driver } from "../types/driver";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";
import { ErrorMessage } from "../../core/types/validation-error";
import { driversRepository } from "../repository/drivers.repository";

export const createDriver = (
  req: Request<unknown, unknown, Omit<Driver, "id" | "createdAt">>,
  res: Response<Driver | ErrorMessage>,
) => {
  const validationErrors = validateDriverInputDto(req.body);
  if (validationErrors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorMessages: validationErrors });
    return;
  }
  const createdDriver = driversRepository.create(req.body);
  res.status(HttpStatus.Created).send(createdDriver);
};
