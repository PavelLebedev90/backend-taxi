import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapRideView } from "../mappers/ride-view";
import { ridesService } from "../application/rides.service";
import { RideMetaView } from "../types/rides-view.types";
import { RideQueryInput } from "../dto/ride-query.input.dto";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";

export const getRidesList = async (
  _req: Request,
  res: Response<RideMetaView, { query: RideQueryInput }>,
) => {
  const { items, totalCount } = await ridesService.getAll(res.locals.query);
  const rides = items.map(mapRideView);
  res.status(HttpStatus.Ok).send(
    mapDataPaginatedView(rides, {
      pageNumber: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount,
    }),
  );
};
