import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapDriverDataView } from "../mappers/driver-view";
import { driversService } from "../application/drivers.service";
import { DriverDataView } from "../types/driver-view.types";

export const getDriver = async (
  req: Request<{ id: string }>,
  res: Response<DriverDataView>,
) => {
  const driver = await driversService.findByIdOrFail(req.params.id);
  res.status(HttpStatus.Ok).send(mapDriverDataView(driver));
};
