import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { DRIVER_ROUTER, TESTING_ROUTER_ALL } from "../../utils/router-path";

describe("Driver API", () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInputDto = {
    name: "Valentin",
    phoneNumber: "12345678",
    email: "valentin@example.com",
    vehicleMake: "BMW1",
    vehicleModel: "X52",
    vehicleYear: 2021,
    vehicleLicensePlate: "ABC-123",
    vehicleDescription: null,
    vehicleFeatures: ["wi-fi"],
  };

  beforeAll(async () => {
    await request(app).delete(TESTING_ROUTER_ALL).expect(HttpStatus.NoContent);
  });

  it("should create driver; POST /api/drivers", async () => {
    const newDriver: DriverInputDto = {
      ...testDriverData,
      name: "Valentin",
      phoneNumber: "123-456-7890",
      email: "valentin@example.com",
    };

    await request(app)
      .post(DRIVER_ROUTER)
      .send(newDriver)
      .expect(HttpStatus.Created);
  });

  it("should return drivers list; GET /api/drivers", async () => {
    await request(app)
      .post(DRIVER_ROUTER)
      .send({ ...testDriverData, name: "Another Driver" })
      .expect(HttpStatus.Created);

    await request(app)
      .post(DRIVER_ROUTER)
      .send({ ...testDriverData, name: "Another Driver2" })
      .expect(HttpStatus.Created);

    const driverListResponse = await request(app)
      .get(DRIVER_ROUTER)
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should return driver by id; GET /api/drivers/:id", async () => {
    const createResponse = await request(app)
      .post(DRIVER_ROUTER)
      .send({ ...testDriverData, name: "Another Driver" })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`${DRIVER_ROUTER}/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it("should update driver by id; PUT /api/drivers/:id", async () => {
    const createResponse = await request(app)
      .post(DRIVER_ROUTER)
      .send({ ...testDriverData, name: "Bad Name", email: "bad-email@mail.ru" })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`${DRIVER_ROUTER}/${createResponse.body.id}`)
      .send({
        ...testDriverData,
        createdAt: createResponse.body.createdAt,
        name: "Good Name",
        email: "good-email@mail.ru",
        id: 9999,
      })
      .expect(HttpStatus.NoContent);

    const updatedDriver = await request(app)
      .get(`${DRIVER_ROUTER}/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(updatedDriver.body).toEqual({
      ...createResponse.body,
      id: createResponse.body.id,
      name: "Good Name",
      email: "good-email@mail.ru",
    });
  });

  it("should delete driver by id; DELETE /api/drivers/:id", async () => {
    const createResponse = await request(app)
      .post(DRIVER_ROUTER)
      .send({ ...testDriverData, name: "Devid" })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`${DRIVER_ROUTER}/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent);
  });
});
