import { Request, Response } from "express";
import { ErrorMessage } from "../../core/types/validation-error";
import { HttpStatus } from "../../core/types/http-statuses";
import { RideCreateInput } from "../dto/ride.input.dto";
import { mapRideDataView } from "../mappers/ride-view";
import { mapRideInputToDTO } from "../mappers/ride-input-to-dto";
import { RideDataView } from "../types/rides-view.types";
import { ridesService } from "../application/rides.service";
import { driversService } from "../../drivers/application/drivers.service";

export const createRide = async (
  req: Request<unknown, unknown, RideCreateInput>,
  res: Response<RideDataView | ErrorMessage>,
) => {
  const driver = await driversService.findByIdOrFail(
    req.body.data.attributes.driverId,
  );

  const createdRideId = await ridesService.create({
    ...mapRideInputToDTO(req.body.data.attributes, driver),
    createdAt: new Date(),
    updatedAt: null,
    startedAt: new Date(),
    finishedAt: null,
  });

  const ride = await ridesService.findByIdOrFail(createdRideId.toString());
  res.status(HttpStatus.Created).send(mapRideDataView(ride));
};
