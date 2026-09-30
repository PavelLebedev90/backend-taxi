import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";
import { ridesService } from "../application/rides.service";

export const finishRide = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const ride = await ridesService.findById(req.params.id);
  if (ride?.finishedAt) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        errorMessagesFormatter([
          { field: "id", message: "Ride already finished" },
        ]),
      );
    return;
  }
  await ridesService.finishRide(req.params.id, new Date());

  res.sendStatus(HttpStatus.NoContent);
};
