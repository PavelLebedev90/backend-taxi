import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { RideMetaView } from "../types/rides-view.types";
import { RideQueryInput } from "../dto/ride-query.input.dto";
import { ridesQueryRepository } from "../repository/rides-query.repository";

export const getRidesList = async (
  _req: Request,
  res: Response<RideMetaView, { query: RideQueryInput }>,
) => {
  const dataWithMeta = await ridesQueryRepository.getAll(res.locals.query);
  res.status(HttpStatus.Ok).send(dataWithMeta);
};
