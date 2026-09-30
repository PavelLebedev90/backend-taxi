import { DriverCreateInput } from "../../../src/drivers/dto/driver.input.dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { DRIVER_ROUTER } from "../../utils/router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { collectCorrectDriver } from "../../utils/drivers/collect-correct.driver";
import { createDriver } from "../../utils/drivers/create.driver";
import { getByIdDriver } from "../../utils/drivers/get-by-id.driver";
import { updateDriver } from "../../utils/drivers/update.driver";
import { setupDbLifecycle } from "../../utils/setup-db";
import { ResourceType } from "../../../src/core/types/resource";

describe("Driver API", () => {
  setupDbLifecycle();

  it("should create driver; POST /api/drivers", async () => {
    const newDriver: DriverCreateInput = {
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Valentin",
          phoneNumber: "123-456-7890",
          email: "valentin@example.com",
        },
      },
    };
    await createDriver(newDriver).expect(HttpStatus.Created);
  });

  it("should return drivers list; GET /api/drivers", async () => {
    await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Another Driver",
        },
      },
    }).expect(HttpStatus.Created);

    await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Another Driver2",
        },
      },
    }).expect(HttpStatus.Created);

    const driverListResponse = await request
      .get(DRIVER_ROUTER)
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body.data).toBeInstanceOf(Array);
    expect(driverListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("should return driver by id; GET /api/drivers/:id", async () => {
    await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Another Driver",
        },
      },
    }).expect(HttpStatus.Created);

    const createResponse = await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Another Driver",
        },
      },
    }).expect(HttpStatus.Created);

    const getResponse = await getByIdDriver(createResponse.body.data.id).expect(
      HttpStatus.Ok,
    );

    expect(getResponse.body).toEqual({
      data: {
        type: ResourceType.Drivers,
        id: expect.any(String),
        attributes: {
          ...createResponse.body.data.attributes,
          createdAt: expect.any(String),
        },
      },
    });
  });

  it("should update driver by id; PUT /api/drivers/:id", async () => {
    const createResponse = await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Bad Name",
          email: "bad-email@mail.ru",
        },
      },
    }).expect(HttpStatus.Created);

    await updateDriver(createResponse.body.data.id, {
      data: {
        ...collectCorrectDriver().data,
        id: createResponse.body.data.id,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Good Name",
          email: "good-email@mail.ru",
        },
      },
    }).expect(HttpStatus.NoContent);

    const updatedDriver = await getByIdDriver(
      createResponse.body.data.id,
    ).expect(HttpStatus.Ok);

    expect(updatedDriver.body).toEqual({
      data: {
        type: ResourceType.Drivers,
        id: createResponse.body.data.id,
        attributes: {
          ...createResponse.body.data.attributes,
          name: "Good Name",
          email: "good-email@mail.ru",
        },
      },
    });
  });

  it("should delete driver by id; DELETE /api/drivers/:id", async () => {
    const createResponse = await createDriver({
      data: {
        ...collectCorrectDriver().data,
        attributes: {
          ...collectCorrectDriver().data.attributes,
          name: "Devid",
        },
      },
    }).expect(HttpStatus.Created);

    await request
      .delete(`${DRIVER_ROUTER}/${createResponse.body.data.id}`)
      .expect(HttpStatus.NoContent);
  });
});
