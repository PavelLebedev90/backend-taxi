import { Request, Response } from "express";
import { ErrorMessage } from "../../core/types/validation-error";
import { Ride } from "../types/rides.types";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { RideInputDto } from "../dto/ride.input.dto";
import { driversRepository } from "../../drivers/repository/drivers.repository";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";

export const createRide = (
  req: Request<unknown, unknown, RideInputDto>,
  res: Response<Ride | ErrorMessage>,
) => {
  const driver = driversRepository.findById(req.body.driverId);
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

  const createdRide = ridesRepository.create(req.body, driver);
  res.status(HttpStatus.Created).send(createdRide);
};
