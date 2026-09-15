import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { Driver } from "../types/driver";
import { driversRepository } from "../repository/drivers.repository";

export const deleteDriver = (
  req: Request<{ id: string }, unknown, Driver>,
  res: Response,
) => {
  const isDeleted = driversRepository.delete(+req.params.id);
  if (!isDeleted) {
    res.status(HttpStatus.BadRequest).send({
      errorMessages: [
        { field: "id", message: `not found Driver by id=${req.body.id}` },
      ],
    });
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
};
