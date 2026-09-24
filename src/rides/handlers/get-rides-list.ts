import { Request, Response } from "express";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapRideView } from "../mappers/ride-view";

export const getRidesList = async (_req: Request, res: Response) => {
  const ridesList = await ridesRepository.getAll();
  res.status(HttpStatus.Ok).send(ridesList.map(mapRideView));
};
