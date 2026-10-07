import { HttpStatus } from "../../../src/core/types/http-statuses";
import { loginAuth } from "../../utils/auth/login.auth";
import { setupDbLifecycle } from "../../utils/setup-db";
import { collectCorrectUser } from "../../utils/users/collect-correct.user";
import { createUser } from "../../utils/users/create.user";

describe("Auth API", () => {
  setupDbLifecycle();
  it("should login user with valid credentials; POST /api/auth/login", async () => {
    const createResponse = await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "loginAuth",
          email: "loginAuth@example.com",
          password: "securePas",
        },
      },
    }).expect(HttpStatus.Created);

    await loginAuth({
      loginOrEmail: "loginAuth",
      password: "securePas",
    }).expect(HttpStatus.Ok);

    await loginAuth({
      loginOrEmail: createResponse.body.data.attributes.email.toLowerCase(),
      password: "securePas",
    }).expect(HttpStatus.Ok);
  });

  it("should not login user with invalid password; POST /api/auth/login", async () => {
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

    await loginAuth({
      loginOrEmail: "wrongpass",
      password: "incorrectPass",
    }).expect(HttpStatus.Unauthorized);
  });

  it("should not login not existing user; POST /api/users/login", async () => {
    await loginAuth({
      loginOrEmail: "ghostuser",
      password: "securePass1",
    }).expect(HttpStatus.NotFound);
  });
});
