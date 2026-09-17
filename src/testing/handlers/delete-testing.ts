import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/data-base";

export const deleteTesting = (req: Request, res: Response) => {
  db.drivers = [];
  db.rides = [];
  res.sendStatus(HttpStatus.NoContent);
};
