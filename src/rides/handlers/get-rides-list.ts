import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapRideView } from "../mappers/ride-view";
import { RideMetaView } from "../types/rides-view.types";
import { RideQueryInput } from "../dto/ride-query.input.dto";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";
import { ridesQueryRepository } from "../repository/rides-query.repository";

export const getRidesList = async (
  _req: Request,
  res: Response<RideMetaView, { query: RideQueryInput }>,
) => {
  const { items, totalCount } = await ridesQueryRepository.getAll(
    res.locals.query,
  );
  const rides = items.map(mapRideView);
  res.status(HttpStatus.Ok).send(
    mapDataPaginatedView(rides, {
      pageNumber: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount,
    }),
  );
};
