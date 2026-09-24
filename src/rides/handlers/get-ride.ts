import { Request, Response } from "express";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapRideView } from "../mappers/ride-view";

export const getRide = async (req: Request<{ id: string }>, res: Response) => {
  const ride = await ridesRepository.findById(req.params.id);
  if (!ride) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Ok).send(mapRideView(ride));
};
