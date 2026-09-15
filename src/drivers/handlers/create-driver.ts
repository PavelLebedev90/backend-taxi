import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Driver } from "../types/driver.types";
import { ErrorMessage } from "../../core/types/validation-error";
import { driversRepository } from "../repository/drivers.repository";

export const createDriver = (
  req: Request<unknown, unknown, Omit<Driver, "id" | "createdAt">>,
  res: Response<Driver | ErrorMessage>,
) => {
  const createdDriver = driversRepository.create(req.body);
  res.status(HttpStatus.Created).send(createdDriver);
};
