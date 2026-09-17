import express from "express";
import { setupApp } from "../../../src/setup-app";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { RIDE_ROUTER } from "../../utils/router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { clearDB } from "../../utils/clear-bb";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";
import { createDriver } from "../../utils/drivers/create.driver";
import { collectCorrectRide } from "../../utils/rides/collect-correct.ride";
import { RideInputDto } from "../../../src/rides/dto/ride.input.dto";
import { createRide } from "../../utils/rides/create.ride";
import { getByIdRide } from "../../utils/rides/get-by-id.ride";

describe("Rides API", () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await clearDB();
  });

  it("should create ride; POST /api/rides", async () => {
    const driver = await createDriver(collectCorrectDriver()).expect(
      HttpStatus.Created,
    );

    const newRide: RideInputDto = {
      ...collectCorrectRide(driver.body.id),
    };
    const ride = await createRide(newRide).expect(HttpStatus.Created);
    expect(ride.body.driverId).toBe(driver.body.id);
  });

  it("should return rides list; GET /api/rides", async () => {
    const driver = await createDriver(collectCorrectDriver()).expect(
      HttpStatus.Created,
    );
    const newRide: RideInputDto = {
      ...collectCorrectRide(driver.body.id),
      clientName: "Pavel",
      price: 33,
    };
    const ride1 = await createRide(newRide).expect(HttpStatus.Created);
    expect(ride1.body.clientName).toBe(newRide.clientName);
    expect(ride1.body.price).toBe(newRide.price);
    expect(ride1.body.driverId).toBe(driver.body.id);

    const ride2 = await createRide({
      ...newRide,
      clientName: "Ivan",
    }).expect(HttpStatus.Created);
    expect(ride2.body.clientName).toBe("Ivan");
    expect(ride2.body.driverId).toBe(driver.body.id);

    const ridesListResponse = await request
      .get(RIDE_ROUTER)
      .expect(HttpStatus.Ok);

    expect(ridesListResponse.body).toBeInstanceOf(Array);
    expect(ridesListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should return ride by id; GET /api/rides/:id", async () => {
    await createDriver({ ...collectCorrectDriver(), name: "Vodila" }).expect(
      HttpStatus.Created,
    );
    const driver = await createDriver({
      ...collectCorrectDriver(),
      name: "Moh",
    }).expect(HttpStatus.Created);

    const newRide: RideInputDto = {
      ...collectCorrectRide(driver.body.id),
      clientName: "Qwerty",
      price: 140,
    };
    const ride = await createRide(newRide).expect(HttpStatus.Created);

    const getResponse = await getByIdRide(ride.body.id).expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...ride.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });
});
