import { Request, Response } from "express";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";

export const getRidesList = (_req: Request, res: Response) => {
  const ridesList = ridesRepository.getAll();
  res.status(HttpStatus.Ok).send(ridesList);
};
