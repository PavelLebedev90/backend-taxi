import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repository/drivers.repository";

export const getDriver = (req: Request<{ id: string }>, res: Response) => {
  const driver = driversRepository.findById(+req.params.id);
  if (!driver) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Ok).send(driver);
};
