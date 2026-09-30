import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapDriverView } from "../mappers/driver-view";
import { driversService } from "../application/drivers.service";
import { mapDataPaginatedView } from "../../core/mappers/data-paginated-view";
import { DriverMetaView } from "../types/driver-view.types";
import { DriverQueryInput } from "../dto/driver-query.input.dto";

export const getDriversList = async (
  req: Request,
  res: Response<DriverMetaView, { query: DriverQueryInput }>,
) => {
  const { items, totalCount } = await driversService.getAll(res.locals.query);
  const drivers = items.map(mapDriverView);
  res.status(HttpStatus.Ok).send(
    mapDataPaginatedView(drivers, {
      pageNumber: res.locals.query.pageNumber,
      pageSize: res.locals.query.pageSize,
      totalCount,
    }),
  );
};
