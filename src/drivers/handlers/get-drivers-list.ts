import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repository/drivers.repository";
import { mapDriverView } from "../mappers/driver-view";

export const getDriversList = async (_req: Request, res: Response) => {
  const driverList = await driversRepository.getAll();
  res.status(HttpStatus.Ok).send(driverList.map(mapDriverView));
};
