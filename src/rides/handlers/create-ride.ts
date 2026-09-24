import { Request, Response } from "express";
import { ErrorMessage } from "../../core/types/validation-error";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { RideInputDto } from "../dto/ride.input.dto";
import { driversRepository } from "../../drivers/repository/drivers.repository";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";
import { mapRideView } from "../mappers/ride-view";
import { mapRideInputToDTO } from "../mappers/ride-input-to-dto";
import { RideView } from "../types/rides-view.types";

export const createRide = async (
  req: Request<unknown, unknown, RideInputDto>,
  res: Response<RideView | ErrorMessage>,
) => {
  const driver = await driversRepository.findById(req.body.driverId);
  if (!driver) {
    res.status(HttpStatus.NotFound).send(
      errorMessagesFormatter([
        {
          field: "driverId",
          message: "not found Driver by driverId",
        },
      ]),
    );
    return;
  }
  const activeRide = await ridesRepository.findActiveRideByDriverId(
    req.body.driverId,
  );

  if (activeRide) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        errorMessagesFormatter([
          { field: "driverId", message: "The driver is currently on a job" },
        ]),
      );

    return;
  }

  const createdRide = await ridesRepository.create({
    ...mapRideInputToDTO(req.body, driver),
    createdAt: new Date(),
    updatedAt: null,
    startedAt: new Date(),
    finishedAt: null,
  });

  if (!createdRide) {
    res.status(HttpStatus.NotFound);
    return;
  }

  res.status(HttpStatus.Created).send(mapRideView(createdRide));
};
