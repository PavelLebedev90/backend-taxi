import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { driversService } from "../application/drivers.service";

export const deleteDriver = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  await driversService.delete(req.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
