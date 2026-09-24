import { Request, Response } from "express";
import { ridesRepository } from "../repository/rides.repository";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";

export const finishRide = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const ride = await ridesRepository.findById(req.params.id);
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
  await ridesRepository.finishRide(req.params.id, new Date());

  res.sendStatus(HttpStatus.NoContent);
};
