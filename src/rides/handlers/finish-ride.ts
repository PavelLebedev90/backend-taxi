import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { ridesService } from "../application/rides.service";
import { ridesQueryRepository } from "../repository/rides-query.repository";

export const finishRide = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const ride = await ridesQueryRepository.findByIdOrFail(req.params.id);

  await ridesService.finishRide(req.params.id, new Date(), ride);

  res.sendStatus(HttpStatus.NoContent);
};
