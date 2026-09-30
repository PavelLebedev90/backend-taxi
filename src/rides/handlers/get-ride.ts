import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapRideDataView } from "../mappers/ride-view";
import { ridesService } from "../application/rides.service";
import { RideDataView } from "../types/rides-view.types";

export const getRide = async (
  req: Request<{ id: string }>,
  res: Response<RideDataView>,
) => {
  const ride = await ridesService.findByIdOrFail(req.params.id);
  res.status(HttpStatus.Ok).send(mapRideDataView(ride));
};
