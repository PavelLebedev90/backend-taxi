import { Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/drivers-db";
import { validateDriverInputDto } from "../validation/driver-input-dto.validation";
import { Driver } from "../types/driver";

export const driversRouter = Router({});

driversRouter.get("/", (req, res) => {
  // возвращаем всех водителей
  res.status(HttpStatus.Ok).send(db.drivers);
});

driversRouter.get("/:id", (req, res) => {
  const driver = db.drivers.find((d) => d.id === +req.params.id);
  if (!driver) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  res.status(HttpStatus.Ok).send(driver);
});

driversRouter.post("/", (req, res) => {
  const lastDriver = db.drivers[db.drivers.length - 1];
  const newDriver: Driver = {
    id: lastDriver ? lastDriver.id + 1 : 1,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    vehicleMake: req.body.vehicleMake,
    vehicleModel: req.body.vehicleModel,
    vehicleYear: req.body.vehicleYear,
    vehicleLicensePlate: req.body.vehicleLicensePlate,
    vehicleDescription: req.body.vehicleDescription,
    vehicleFeatures: req.body.vehicleFeatures,
    createdAt: new Date(),
  };
  const validationErrors = validateDriverInputDto(newDriver);
  if (validationErrors.length > 0) {
    res.status(HttpStatus.BadRequest).send({ errorMessages: validationErrors });
    return;
  }
  db.drivers.push(newDriver);
  res.status(HttpStatus.Created).send(newDriver);
});
