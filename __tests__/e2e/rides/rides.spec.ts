import { HttpStatus } from "../../../src/core/types/http-statuses";
import { RIDE_ROUTER } from "../../utils/router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";
import { createDriver } from "../../utils/drivers/create.driver";
import { collectCorrectRide } from "../../utils/rides/collect-correct.ride";
import { RideCreateInput } from "../../../src/rides/dto/ride.input.dto";
import { createRide } from "../../utils/rides/create.ride";
import { getByIdRide } from "../../utils/rides/get-by-id.ride";
import { setupDbLifecycle } from "../../utils/setup-db";
import { ResourceType } from "../../../src/core/types/resource";

describe("Rides API", () => {
  setupDbLifecycle();

  it("should create ride; POST /api/rides", async () => {
    const driver = await createDriver(collectCorrectDriver()).expect(
      HttpStatus.Created,
    );

    const newRide: RideCreateInput = {
      ...collectCorrectRide(driver.body.data.id),
    };
    const ride = await createRide(newRide).expect(HttpStatus.Created);
    expect(ride.body.data.attributes.driver.id).toBe(driver.body.data.id);
  });

  it("should return rides list; GET /api/rides", async () => {
    const driver = await createDriver(collectCorrectDriver()).expect(
      HttpStatus.Created,
    );
    const newRide: RideCreateInput = {
      data: {
        ...collectCorrectRide(driver.body.data.id).data,
        attributes: {
          ...collectCorrectRide(driver.body.data.id).data.attributes,
          clientName: "Pavel",
          price: 33,
        },
      },
    };
    const ride1 = await createRide(newRide).expect(HttpStatus.Created);
    expect(ride1.body.data.attributes.clientName).toBe(
      newRide.data.attributes.clientName,
    );
    expect(ride1.body.data.attributes.price).toBe(
      newRide.data.attributes.price,
    );
    expect(ride1.body.data.attributes.driver.id).toBe(driver.body.data.id);

    const ride2 = await createRide({
      data: {
        ...newRide.data,
        attributes: {
          ...newRide.data.attributes,
          clientName: "Ivan",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(ride2.body.errorMessages[0]).toEqual({
      field: "ride.driver.id",
      message: expect.any(String),
    });

    const ridesListResponse = await request
      .get(RIDE_ROUTER)
      .expect(HttpStatus.Ok);

    expect(ridesListResponse.body.data).toBeInstanceOf(Array);
    expect(ridesListResponse.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("should return ride by id; GET /api/rides/:id", async () => {
    await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Vodila",
        },
      },
    }).expect(HttpStatus.Created);
    const driver = await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Moh",
        },
      },
    }).expect(HttpStatus.Created);

    const newRide: RideCreateInput = {
      data: {
        ...collectCorrectRide(driver.body.data.id).data,
        attributes: {
          ...collectCorrectRide(driver.body.data.id).data.attributes,
          clientName: "Qwerty",
          price: 140,
        },
      },
    };
    const ride = await createRide(newRide).expect(HttpStatus.Created);

    const getResponse = await getByIdRide(ride.body.data.id).expect(
      HttpStatus.Ok,
    );

    expect(getResponse.body).toEqual({
      data: {
        type: ResourceType.Rides,
        id: expect.any(String),
        attributes: expect.any(Object),
      },
    });
  });
});
