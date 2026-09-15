import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/drivers-db";

export const deleteTesting = (req: Request, res: Response) => {
  db.drivers = [];
  res.sendStatus(HttpStatus.NoContent);
};
