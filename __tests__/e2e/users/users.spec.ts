import { UserCreateInput } from "../../../src/users/dto/user.input.dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { USER_ROUTER } from "../../utils/router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { collectCorrectUser } from "../../utils/users/collect-correct.user";
import { createUser } from "../../utils/users/create.user";
import { getByIdUser } from "../../utils/users/get-by-id.user";
import { updateUser } from "../../utils/users/update.user";
import { loginUser } from "../../utils/users/login.user";
import { setupDbLifecycle } from "../../utils/setup-db";
import { ResourceType } from "../../../src/core/types/resource";

describe("User API", () => {
  setupDbLifecycle();

  it("should create user; POST /api/users", async () => {
    const newUser: UserCreateInput = {
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "valentin",
          email: "valentin@example.com",
        },
      },
    };
    const createResponse = await createUser(newUser).expect(
      HttpStatus.Created,
    );

    expect(createResponse.body).toEqual({
      data: {
        type: ResourceType.Users,
        id: expect.any(String),
        attributes: {
          firstName: newUser.data.attributes.firstName,
          lastName: newUser.data.attributes.lastName,
          middleName: newUser.data.attributes.middleName,
          phoneNumber: newUser.data.attributes.phoneNumber,
          email: newUser.data.attributes.email,
          createdAt: expect.any(String),
        },
      },
    });
    expect(createResponse.body.data.attributes).not.toHaveProperty("login");
    expect(createResponse.body.data.attributes).not.toHaveProperty(
      "password",
    );
    expect(createResponse.body.data.attributes).not.toHaveProperty(
      "passwordHash",
    );
  });

  it("should return users list; GET /api/users", async () => {
    await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "anotheruser1",
          email: "anotheruser1@example.com",
        },
      },
    }).expect(HttpStatus.Created);

    await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "anotheruser2",
          email: "anotheruser2@example.com",
        },
      },
    }).expect(HttpStatus.Created);

    const userListResponse = await request
      .get(USER_ROUTER)
      .expect(HttpStatus.Ok);

    expect(userListResponse.body.data).toBeInstanceOf(Array);
    expect(userListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it("should return user by id; GET /api/users/:id", async () => {
    const createResponse = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "getbyid",
          email: "getbyid@example.com",
        },
      },
    }).expect(HttpStatus.Created);

    const getResponse = await getByIdUser(createResponse.body.data.id).expect(
      HttpStatus.Ok,
    );

    expect(getResponse.body).toEqual({
      data: {
        type: ResourceType.Users,
        id: createResponse.body.data.id,
        attributes: {
          ...createResponse.body.data.attributes,
          createdAt: expect.any(String),
        },
      },
    });
  });

  it("should return 404 when user by id not found; GET /api/users/:id", async () => {
    await getByIdUser("000000000000000000000000").expect(
      HttpStatus.NotFound,
    );
  });

  it("should update user by id; PUT /api/users/:id", async () => {
    const createResponse = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "badname",
          email: "bad-email@mail.ru",
          firstName: "Bad",
        },
      },
    }).expect(HttpStatus.Created);

    await updateUser(createResponse.body.data.id, {
      data: {
        type: ResourceType.Users,
        id: createResponse.body.data.id,
        attributes: {
          firstName: "Good",
          lastName: createResponse.body.data.attributes.lastName,
          middleName: createResponse.body.data.attributes.middleName,
          phoneNumber: createResponse.body.data.attributes.phoneNumber,
          email: "good-email@mail.ru",
        },
      },
    }).expect(HttpStatus.NoContent);

    const updatedUser = await getByIdUser(createResponse.body.data.id).expect(
      HttpStatus.Ok,
    );

    expect(updatedUser.body).toEqual({
      data: {
        type: ResourceType.Users,
        id: createResponse.body.data.id,
        attributes: {
          ...createResponse.body.data.attributes,
          firstName: "Good",
          email: "good-email@mail.ru",
        },
      },
    });
  });

  it("should return 400 when updating non-existing user; PUT /api/users/:id", async () => {
    const correctUser = collectCorrectUser();
    await updateUser("000000000000000000000000", {
      data: {
        type: ResourceType.Users,
        id: "000000000000000000000000",
        attributes: {
          firstName: correctUser.data.attributes.firstName,
          lastName: correctUser.data.attributes.lastName,
          middleName: correctUser.data.attributes.middleName,
          phoneNumber: correctUser.data.attributes.phoneNumber,
          email: correctUser.data.attributes.email,
        },
      },
    }).expect(HttpStatus.BadRequest);
  });

  it("should delete user by id; DELETE /api/users/:id", async () => {
    const createResponse = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "devid",
          email: "devid@example.com",
        },
      },
    }).expect(HttpStatus.Created);

    await request
      .delete(`${USER_ROUTER}/${createResponse.body.data.id}`)
      .expect(HttpStatus.NoContent);

    await getByIdUser(createResponse.body.data.id).expect(
      HttpStatus.NotFound,
    );
  });

  it("should return 400 when deleting non-existing user; DELETE /api/users/:id", async () => {
    await request
      .delete(`${USER_ROUTER}/000000000000000000000000`)
      .expect(HttpStatus.BadRequest);
  });

  it("should login user with valid credentials; POST /api/users/login", async () => {
    const createResponse = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "loginuser",
          email: "loginuser@example.com",
          password: "securePass1",
        },
      },
    }).expect(HttpStatus.Created);

    await loginUser({
      loginOrEmail: "loginuser",
      password: "securePass1",
    }).expect(HttpStatus.Ok);

    await loginUser({
      loginOrEmail: createResponse.body.data.attributes.email,
      password: "securePass1",
    }).expect(HttpStatus.Ok);
  });

  it("should not login user with invalid password; POST /api/users/login", async () => {
    await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "wrongpass",
          email: "wrongpass@example.com",
          password: "securePass1",
        },
      },
    }).expect(HttpStatus.Created);

    await loginUser({
      loginOrEmail: "wrongpass",
      password: "incorrectPass",
    }).expect(HttpStatus.Unauthorized);
  });

  it("should not login not existing user; POST /api/users/login", async () => {
    await loginUser({
      loginOrEmail: "ghostuser",
      password: "securePass1",
    }).expect(HttpStatus.NotFound);
  });
});
