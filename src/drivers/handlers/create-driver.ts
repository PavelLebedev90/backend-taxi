import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { DriverCreateInput } from "../dto/driver.input.dto";
import { mapDriverInputToDTO } from "../mappers/driver-input-to-dto";
import { mapDriverDataView } from "../mappers/driver-view";
import { driversService } from "../application/drivers.service";
import { DriverDataView } from "../types/driver-view.types";

export const createDriver = async (
  req: Request<unknown, unknown, DriverCreateInput>,
  res: Response<DriverDataView>,
) => {
  const createdDriverId = await driversService.create({
    ...mapDriverInputToDTO(req.body.data.attributes),
    createdAt: new Date(),
  });
  const driver = await driversService.findByIdOrFail(
    createdDriverId.toString(),
  );
  res.status(HttpStatus.Created).send(mapDriverDataView(driver));
};
