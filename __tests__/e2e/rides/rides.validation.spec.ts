import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createDriver } from "../../utils/drivers/create.driver";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";
import { createRide } from "../../utils/rides/create.ride";
import { collectCorrectRide } from "../../utils/rides/collect-correct.ride";
import { ObjectId } from "mongodb";
import { setupDbLifecycle } from "../../utils/setup-db";
import { DriverView } from "../../../src/drivers/types/driver-view.types";
import { finishRide } from "../../utils/rides/finish.ride";
import { getByIdRide } from "../../utils/rides/get-by-id.ride";
import { isoDateRegex } from "../../utils/regex";

describe("Ride API body validation check", () => {
  setupDbLifecycle();
  let driver: DriverView;
  beforeEach(async () => {
    const driverRes = await createDriver(collectCorrectDriver()).expect(
      HttpStatus.Created,
    );
    driver = driverRes.body.data;
  });

  it("should not create ride when incorrect body passed; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: "   ",
          currency: "rub",
          price: null,
          fromAddress: "   ",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);
  });
  it("should not create ride when type is not valid; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        type: "bla-bla",
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create ride when clientName is null; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: null,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
    expect(invalidDataSet1.body.errorMessages[0].field).toBe(
      "data.attributes.clientName",
    );
  });
  it("should not create ride when clientName is undefined; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: undefined,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
    expect(invalidDataSet1.body.errorMessages[0].field).toBe(
      "data.attributes.clientName",
    );
  });

  it("should not create ride when clientName is incorrect type; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: ["invalid type"],
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when clientName is too short; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: "A",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when clientName is too long; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: "AAAAAAAAAAAAAAAA", // 16 characters, assuming maxLength is 15
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should create ride when clientName is valid; POST /rides", async () => {
    const validDriver = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          clientName: "John Doe",
        },
      },
    }).expect(HttpStatus.Created);
    expect(validDriver.body.data).toHaveProperty("id");
  });

  it("should not create ride when price is too big; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          price: 1000,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when proce is empty; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          price: undefined,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when price is too small; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          price: 1,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should create ride when price is fractional; POST /rides", async () => {
    await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          price: 40.43,
        },
      },
    }).expect(HttpStatus.Created);
  });
  it("should not create ride when currency is invalid format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          currency: "a",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when currency is null; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          currency: null,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when currency is not valid format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          currency: ["eur"],
        },
      },
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
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          driverId: new ObjectId().toString(),
        },
      },
    }).expect(HttpStatus.NotFound);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress is not valid format; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          fromAddress: [],
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress is null; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          fromAddress: null,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress is empty; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          fromAddress: "     ",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress to small; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          fromAddress: "aa",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when fromAddress to big; POST /rides", async () => {
    const invalidDataSet1 = await createRide({
      data: {
        ...collectCorrectRide(driver.id).data,
        attributes: {
          ...collectCorrectRide(driver.id).data.attributes,
          fromAddress: "a".repeat(102),
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });
  it("should not create ride when The driver is currently on a job; POST /rides", async () => {
    await createRide(collectCorrectRide(driver.id)).expect(HttpStatus.Created);

    const ride2 = await createRide(collectCorrectRide(driver.id)).expect(
      HttpStatus.BadRequest,
    );
    expect(ride2.body.errorMessages).toHaveLength(1);
  });
  it("should finish ride; put /:id/actions/finish", async () => {
    const ride = await createRide(collectCorrectRide(driver.id)).expect(
      HttpStatus.Created,
    );
    await finishRide(ride.body.data.id, new Date()).expect(
      HttpStatus.NoContent,
    );

    const updatedRide = await getByIdRide(ride.body.data.id).expect(
      HttpStatus.Ok,
    );

    expect(updatedRide.body.data.attributes.finishedAt).toMatch(isoDateRegex);

    await finishRide(ride.body.data.id, new Date()).expect(
      HttpStatus.BadRequest,
    );
    const updatedRide2 = await getByIdRide(ride.body.data.id).expect(
      HttpStatus.Ok,
    );
    expect(updatedRide.body.data.attributes.finishedAt).toBe(
      updatedRide2.body.data.attributes.finishedAt,
    );

    const ride2 = await createRide(collectCorrectRide(driver.id)).expect(
      HttpStatus.Created,
    );

    expect(ride2.body.data.id).toBeDefined();
  });
});
