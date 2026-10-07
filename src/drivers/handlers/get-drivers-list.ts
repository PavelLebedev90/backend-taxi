import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { DriverMetaView } from "../types/driver-view.types";
import { DriverQueryInput } from "../dto/driver-query.input.dto";
import { driversQueryRepository } from "../repository/drivers-query.repository";

export const getDriversList = async (
  _req: Request,
  res: Response<DriverMetaView, { query: DriverQueryInput }>,
) => {
  const dataWithMeta = await driversQueryRepository.getAll(res.locals.query);
  res.status(HttpStatus.Ok).send(dataWithMeta);
};
