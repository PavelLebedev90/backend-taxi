import express from "express";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { VehicleFeature } from "../../../src/drivers/types/driver.types";
import { setupApp } from "../../../src/setup-app";
import { clearDB } from "../../utils/clear-bb";
import { createDriver } from "../../utils/drivers/create.driver";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";

describe("Driver API body validation check", () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await clearDB();
  });

  it("should not create driver when incorrect body passed; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "   ",
      phoneNumber: "    ",
      email: "invalid email",
      vehicleMake: "",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
  });

  it("should not create driver when name is null; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: null,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when name is undefined; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: undefined,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create driver when name is incorrect type; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: ["invalid type"],
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when name is too short; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "A",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when name is too long; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "AAAAAAAAAAAAAAAA", // 16 characters, assuming maxLength is 15
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should create driver when name is valid; POST /drivers", async () => {
    const validDriver = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
    }).expect(HttpStatus.Created);
    expect(validDriver.body).toHaveProperty("id");
  });

  it("should not create driver when email is too long; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      email: "a".repeat(101) + "@example.com", // 101 characters, assuming maxLength is 100
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when email is empty; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      email: "  ",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when email is invalid format; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      email: "not-an-email@",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is invalid format; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: "not-a-number",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is null; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: null,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is too large; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: new Date().getFullYear() + 10,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleYear is too small; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1899,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleFeatures is not Array; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1934,
      vehicleFeatures: "not-an-array",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should create driver when vehicleFeatures is empty Array; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1934,
      vehicleFeatures: [],
    }).expect(HttpStatus.Created);
    expect(invalidDataSet1.body.vehicleFeatures).toHaveLength(0);
  });
  it("should not create driver when vehicleFeatures is undefined; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1934,
      vehicleFeatures: undefined,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create driver when vehicleFeatures has not valid item; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1934,
      vehicleFeatures: [
        "not-a-valid-feature",
        VehicleFeature.WiFi,
        VehicleFeature.PetFriendly,
      ],
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should create driver when vehicleFeatures has valid items; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1934,
      vehicleFeatures: [VehicleFeature.WiFi, VehicleFeature.PetFriendly],
    }).expect(HttpStatus.Created);
    expect(invalidDataSet1.body.vehicleFeatures).toHaveLength(2);
  });
  it("should create driver when vehicleFeatures has valid items; POST /drivers", async () => {
    const invalidDataSet1 = await createDriver({
      ...collectCorrectDriver(),
      name: "John Doe",
      vehicleYear: 1934,
      vehicleFeatures: [
        VehicleFeature.WiFi,
        VehicleFeature.PetFriendly,
        VehicleFeature.ChildSeat,
        VehicleFeature.WiFi,
      ],
    }).expect(HttpStatus.Created);
    expect(invalidDataSet1.body.vehicleFeatures).toHaveLength(4);
  });
});
