import express, { Express } from "express";
import { driversRouter } from "./drivers/routers/drivers.router";
import { testingRouter } from "./testing/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("Hello, World!");
  });

  app.use("/api/drivers", driversRouter);
  app.use("/api/testing", testingRouter);

  setupSwagger(app);
  return app;
};
