import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repository/drivers.repository";

export const getDriversList = (_req: Request, res: Response) => {
  const driverList = driversRepository.getAll();
  res.status(HttpStatus.Ok).send(driverList);
};
