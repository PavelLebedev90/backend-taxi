import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create.user";
import { collectCorrectUser } from "../../utils/users/collect-correct.user";
import { setupDbLifecycle } from "../../utils/setup-db";

describe("User API body validation check", () => {
  setupDbLifecycle();

  it("should not create user when type is not valid; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        type: "rides",
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when firstName is too short; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          firstName: "A",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when firstName is too long; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          firstName: "A".repeat(16),
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when firstName is null; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          firstName: null,
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when lastName is too short; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          lastName: "A",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should create user when middleName is omitted (optional nullable); POST /users", async () => {
    const validUser = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "nomiddlename",
          email: "nomiddlename@example.com",
          middleName: null,
        },
      },
    }).expect(HttpStatus.Created);
    expect(validUser.body.data.attributes.middleName).toBeNull();
  });

  it("should not create user when middleName is too short; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          middleName: "A",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when phoneNumber is invalid; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          phoneNumber: "not-a-phone",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when email is invalid format; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          email: "not-an-email@",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when email is empty; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          email: "  ",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when login is too short; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "A",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when login is too long; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "A".repeat(16),
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when password is too short; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          password: "short",
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when password is too long; POST /users", async () => {
    const invalidDataSet1 = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          password: "A".repeat(16),
        },
      },
    }).expect(HttpStatus.BadRequest);
    expect(invalidDataSet1.body.errorMessages).toHaveLength(1);
  });

  it("should not create user when email already exists; POST /users", async () => {
    await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "firstuser",
          email: "duplicate@example.com",
        },
      },
    }).expect(HttpStatus.Created);

    const duplicateResponse = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "seconduser",
          email: "duplicate@example.com",
        },
      },
    }).expect(HttpStatus.BadRequest);

    expect(duplicateResponse.body.errorMessages[0]).toEqual({
      field: "email",
      message: expect.any(String),
    });
  });

  it("should create user when body is valid; POST /users", async () => {
    const validUser = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "validuser",
          email: "validuser@example.com",
        },
      },
    }).expect(HttpStatus.Created);
    expect(validUser.body.data).toHaveProperty("id");
  });
});
