import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repository/drivers.repository";
import { mapDriverView } from "../mappers/driver-view";

export const getDriver = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const driver = await driversRepository.findById(req.params.id);
  if (!driver) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Ok).send(mapDriverView(driver));
};
