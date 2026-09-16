import express from "express";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";
import { VehicleFeature } from "../../../src/drivers/types/driver.types";
import { setupApp } from "../../../src/setup-app";
import { DRIVER_ROUTER, TESTING_ROUTER_ALL } from "../../utils/router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";

describe("Driver API body validation check", () => {
  const app = express();
  setupApp(app); // подключает все middleware, маршруты и необходимые настройки

  const correctTestDriverData: DriverInputDto = {
    name: "Valentin",
    phoneNumber: "123-456-7890",
    email: "valentin@example.com",
    vehicleMake: "BMW",
    vehicleModel: "X5",
    vehicleYear: 2021,
    vehicleLicensePlate: "ABC-123",
    vehicleDescription: "Some description",
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  beforeAll(async () => {
    await request.delete(TESTING_ROUTER_ALL).expect(HttpStatus.NoContent);
  });

  it("should not create driver when incorrect body passed; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "   ",
        phoneNumber: "    ",
        email: "invalid email",
        vehicleMake: "",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
  });

  it("should not create driver when name is null; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: null,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when name is undefined; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: undefined,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create driver when name is incorrect type; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: ["invalid type"],
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when name is too short; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "A",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when name is too long; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "AAAAAAAAAAAAAAAA", // 16 characters, assuming maxLength is 15
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should create driver when name is valid; POST /drivers", async () => {
    const validDriver = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
      })
      .expect(HttpStatus.Created);
    expect(validDriver.body).toHaveProperty("id");
  });

  it("should not create driver when email is too long; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        email: "a".repeat(101) + "@example.com", // 101 characters, assuming maxLength is 100
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when email is empty; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        email: "  ",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when email is invalid format; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        email: "not-an-email@",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is invalid format; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: "not-a-number",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is null; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: null,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is too large; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: new Date().getFullYear() + 10,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is too small; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1899,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleFeatures is not Array; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1934,
        vehicleFeatures: "not-an-array",
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should create driver when vehicleFeatures is empty Array; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1934,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.Created);
    expect(invalidDataSet1.body.vehicleFeatures).toHaveLength(0);
  });
  it("should not create driver when vehicleFeatures is undefined; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1934,
        vehicleFeatures: undefined,
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleFeatures has not valid item; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1934,
        vehicleFeatures: [
          "not-a-valid-feature",
          VehicleFeature.WiFi,
          VehicleFeature.PetFriendly,
        ],
      })
      .expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should create driver when vehicleFeatures has valid items; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1934,
        vehicleFeatures: [VehicleFeature.WiFi, VehicleFeature.PetFriendly],
      })
      .expect(HttpStatus.Created);
    expect(invalidDataSet1.body.vehicleFeatures).toHaveLength(2);
  });
  it("should create driver when vehicleFeatures has valid items; POST /drivers", async () => {
    const invalidDataSet1 = await request
      .post(DRIVER_ROUTER)
      .send({
        ...correctTestDriverData,
        name: "John Doe",
        vehicleYear: 1934,
        vehicleFeatures: [
          VehicleFeature.WiFi,
          VehicleFeature.PetFriendly,
          VehicleFeature.ChildSeat,
          VehicleFeature.WiFi,
        ],
      })
      .expect(HttpStatus.Created);
    expect(invalidDataSet1.body.vehicleFeatures).toHaveLength(4);
  });
});
