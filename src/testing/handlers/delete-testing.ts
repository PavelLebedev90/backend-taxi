import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import {
  driverCollection,
  rideCollection,
  userCollection,
} from "../../db/collections";

export const deleteTesting = async (req: Request, res: Response) => {
  await Promise.all([
    driverCollection.deleteMany({}),
    rideCollection.deleteMany({}),
    userCollection.deleteMany({}),
  ]);
  res.sendStatus(HttpStatus.NoContent);
};
