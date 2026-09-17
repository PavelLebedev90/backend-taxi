import { Request, Response } from "express";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";

export const getRide = (req: Request<{ id: string }>, res: Response) => {
  const ride = ridesRepository.findById(+req.params.id);
  if (!ride) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Ok).send(ride);
};
