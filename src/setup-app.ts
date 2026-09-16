import express, { Express } from "express";
import { driversRouter } from "./drivers/routers/drivers.router";
import { testingRouter } from "./testing/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { DRIVER_ROUTE } from "./core/constants/drivers-router.path";
import { TESTING_ROUTE } from "./core/constants/testing-router.path";
import { BASE_ROUTE } from "./settings/config";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("Hello, World!");
  });

  app.use(`${BASE_ROUTE}${DRIVER_ROUTE.DRIVERS}`, driversRouter);
  app.use(`${BASE_ROUTE}${TESTING_ROUTE.TESTING}`, testingRouter);

  setupSwagger(app);
  return app;
};
