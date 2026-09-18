import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Driver } from "../types/driver.types";
import { driversRepository } from "../repository/drivers.repository";
import { errorMessagesFormatter } from "../../core/utils/formatter/error-messages.formatter";

export const updateDriver = (
  req: Request<{ id: string }, unknown, Driver>,
  res: Response,
) => {
  const isUpdated = driversRepository.update(+req.params.id, req.body);
  if (!isUpdated) {
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
