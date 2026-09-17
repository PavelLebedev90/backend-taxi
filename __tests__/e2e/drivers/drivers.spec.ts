import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { DRIVER_ROUTER } from "../../utils/router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { clearDB } from "../../utils/clear-bb";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";
import { createDriver } from "../../utils/drivers/create.driver";
import { getByIdDriver } from "../../utils/drivers/get-by-id.driver";
import { updateDriver } from "../../utils/drivers/update.driver";

describe("Driver API", () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await clearDB();
  });

  it("should create driver; POST /api/drivers", async () => {
    const newDriver: DriverInputDto = {
      ...collectCorrectDriver(),
      name: "Valentin",
      phoneNumber: "123-456-7890",
      email: "valentin@example.com",
    };
    await createDriver(newDriver).expect(HttpStatus.Created);
  });

  it("should return drivers list; GET /api/drivers", async () => {
    await createDriver({
      ...collectCorrectDriver(),
      name: "Another Driver",
    }).expect(HttpStatus.Created);

    await createDriver({
      ...collectCorrectDriver(),
      name: "Another Driver2",
    }).expect(HttpStatus.Created);

    const driverListResponse = await request
      .get(DRIVER_ROUTER)
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should return driver by id; GET /api/drivers/:id", async () => {
    await createDriver({
      ...collectCorrectDriver(),
      name: "Another Driver",
    }).expect(HttpStatus.Created);

    const createResponse = await createDriver({
      ...collectCorrectDriver(),
      name: "Another Driver",
    }).expect(HttpStatus.Created);

    const getResponse = await getByIdDriver(createResponse.body.id).expect(
      HttpStatus.Ok,
    );

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it("should update driver by id; PUT /api/drivers/:id", async () => {
    const createResponse = await createDriver({
      ...collectCorrectDriver(),
      name: "Bad Name",
      email: "bad-email@mail.ru",
    }).expect(HttpStatus.Created);

    await updateDriver(createResponse.body.id, {
      ...collectCorrectDriver(),
      createdAt: createResponse.body.createdAt,
      name: "Good Name",
      email: "good-email@mail.ru",
      id: 9999,
    }).expect(HttpStatus.NoContent);

    const updatedDriver = await getByIdDriver(createResponse.body.id).expect(
      HttpStatus.Ok,
    );

    expect(updatedDriver.body).toEqual({
      ...createResponse.body,
      id: createResponse.body.id,
      name: "Good Name",
      email: "good-email@mail.ru",
    });
  });

  it("should delete driver by id; DELETE /api/drivers/:id", async () => {
    const createResponse = await createDriver({
      ...collectCorrectDriver(),
      name: "Devid",
    }).expect(HttpStatus.Created);

    await request
      .delete(`${DRIVER_ROUTER}/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent);
  });
});
