import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapDriverDataView } from "../mappers/driver-view";
import { DriverDataView } from "../types/driver-view.types";
import { driversQueryRepository } from "../repository/drivers-query.repository";

export const getDriver = async (
  req: Request<{ id: string }>,
  res: Response<DriverDataView>,
) => {
  const driver = await driversQueryRepository.findByIdOrFail(req.params.id);
  res.status(HttpStatus.Ok).send(mapDriverDataView(driver));
};
