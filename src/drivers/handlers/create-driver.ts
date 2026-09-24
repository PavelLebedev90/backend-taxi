import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Driver } from "../types/driver.types";
import { ErrorMessage } from "../../core/types/validation-error";
import { driversRepository } from "../repository/drivers.repository";
import { DriverInputDto } from "../dto/driver.input.dto";
import { mapDriverInputToDTO } from "../mappers/driver-input-to-dto";
import { mapDriverView } from "../mappers/driver-view";

export const createDriver = async (
  req: Request<unknown, unknown, DriverInputDto>,
  res: Response<Driver | ErrorMessage>,
) => {
  const createdDriver = await driversRepository.create({
    ...mapDriverInputToDTO(req.body),
    createdAt: new Date(),
  });
  if (!createdDriver) {
    res.status(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Created).send(mapDriverView(createdDriver));
};
