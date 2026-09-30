import express, { Express, Request, Response, NextFunction } from "express";
import { driversRouter } from "./drivers/routers/drivers.router";
import { testingRouter } from "./testing/routers/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { DRIVER_ROUTE } from "./core/constants/drivers-router.path";
import { TESTING_ROUTE } from "./core/constants/testing-router.path";
import { BASE_ROUTE } from "./settings/config";
import { RIDE_ROUTE } from "./core/constants/rides-router.path";
import { ridesRouter } from "./rides/routers/rides.router";
import { HttpStatus } from "./core/types/http-statuses";
import { errorMessagesFormatter } from "./core/utils/formatter/error-messages.formatter";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("Hello, World!");
  });

  app.use(`${BASE_ROUTE}${DRIVER_ROUTE.DRIVERS}`, driversRouter);
  app.use(`${BASE_ROUTE}${RIDE_ROUTE.RIDES}`, ridesRouter);
  app.use(`${BASE_ROUTE}${TESTING_ROUTE.TESTING}`, testingRouter);

  setupSwagger(app);

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
      const cause = err.cause as { status: number; field: string };
      res.status(cause?.status ?? 500).send(
        errorMessagesFormatter([
          {
            field: cause?.field ?? "",
            message: err?.message ?? "Internal Server Error",
          },
        ]),
      );
      return;
    }
    res.sendStatus(HttpStatus.InternalServerError);
  });

  return app;
};
