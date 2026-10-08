import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { RideDataView } from "../types/rides-view.types";
import { ridesQueryRepository } from "../repository/rides-query.repository";

export const getRide = async (
  req: Request<{ id: string }>,
  res: Response<RideDataView>,
) => {
  const ride = await ridesQueryRepository.findByIdOrFail(req.params.id);
  res.status(HttpStatus.Ok).send(ride);
};
