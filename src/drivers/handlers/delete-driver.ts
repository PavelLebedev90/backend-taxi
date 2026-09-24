import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversRepository } from "../repository/drivers.repository";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";
import { ridesRepository } from "../../rides/repository/rides.repository";

export const deleteDriver = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const activeRide = await ridesRepository.findActiveRideByDriverId(
    req.params.id,
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

  const isDeleted = await driversRepository.delete(req.params.id);
  if (!isDeleted) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        errorMessagesFormatter([
          { field: "id", message: `not found Driver by id=${req.params.id}` },
        ]),
      );
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
};
