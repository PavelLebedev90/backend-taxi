import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mapDriverInputToDTO } from "../mappers/driver-input-to-dto";
import { DriverUpdateInput } from "../dto/driver.input.dto";
import { driversService } from "../application/drivers.service";

export const updateDriver = async (
  req: Request<{ id: string }, unknown, DriverUpdateInput>,
  res: Response,
) => {
  await driversService.update(
    req.params.id,
    mapDriverInputToDTO(req.body.data.attributes),
  );
  res.sendStatus(HttpStatus.NoContent);
};
