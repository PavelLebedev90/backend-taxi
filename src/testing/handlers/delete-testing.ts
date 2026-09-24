import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driverCollection, rideCollection } from "../../db/collections";

export const deleteTesting = (req: Request, res: Response) => {
  driverCollection.deleteMany({});
  rideCollection.deleteMany({});
  res.sendStatus(HttpStatus.NoContent);
};
