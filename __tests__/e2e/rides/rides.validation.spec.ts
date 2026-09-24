import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createDriver } from "../../utils/drivers/create.driver";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";
import { createRide } from "../../utils/rides/create.ride";
import { collectCorrectRide } from "../../utils/rides/collect-correct.ride";
import { ObjectId } from "mongodb";
import { setupDbLifecycle } from "../../utils/setup-db";
import { DriverView } from "../../../src/drivers/types/driver-view.types";

describe("Ride API body validation check", () => {
  setupDbLifecycle();
  let driver: DriverView;
  beforeEach(async () => {
    const driverRes = await createDriver(collectCorrectDriver()).expect(
      HttpStatus.Created,
    );
    driver = driverRes.body;
  });

  it("should not create ride when incorrect body passed; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "   ",
      currency: "rub",
      price: null,
      fromAddress: "   ",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
  });

  it("should not create ride when clientName is null; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: null,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
    expect(invalidDataSet1.body.errorMessages[0].field).toBe("clientName");
  });
  it("should not create ride when clientName is undefined; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: undefined,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
    expect(invalidDataSet1.body.errorMessages[0].field).toBe("clientName");
  });

  it("should not create ride when clientName is incorrect type; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: ["invalid type"],
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when clientName is too short; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "A",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when clientName is too long; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "AAAAAAAAAAAAAAAA", // 16 characters, assuming maxLength is 15
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should create ride when clientName is valid; POST /rides", async () => {
    const validDriver = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "John Doe",
    }).expect(HttpStatus.Created);
    expect(validDriver.body).toHaveProperty("id");
  });

  it("should not create ride when price is too big; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "John Doe",
      price: 1000,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when proce is empty; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "John Doe",
      price: undefined,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when price is too small; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "John Doe",
      price: 1,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should create ride when price is fractional; POST /rides", async () => {
    await createRide({
      ...collectCorrectRide(driver.id),
      clientName: "John Doe",
      price: 40.43,
    }).expect(HttpStatus.Created);
  });
  it("should not create ride when currency is invalid format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      currency: "a",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when currency is null; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      currency: null,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when currency is not valid format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      currency: ["eur"],
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when driver for driverId is not found; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(new ObjectId().toString()),
    }).expect(HttpStatus.NotFound);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when driverId is bad format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      driverId: 13212,
    }).expect(HttpStatus.NotFound);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress is not valid format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      fromAddress: [],
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress is null; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      fromAddress: null,
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress is empty; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      fromAddress: "     ",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress to small; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      fromAddress: "aa",
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress to big; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      ...collectCorrectRide(driver.id),
      fromAddress: "a".repeat(102),
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
});
