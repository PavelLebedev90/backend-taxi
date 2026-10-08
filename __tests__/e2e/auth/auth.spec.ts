import request from "supertest";
import { sign } from "jsonwebtoken";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { JWT_SECRET } from "../../../src/settings/config";
import { app } from "../../constants/app-express";
import { AUTH_ROUTER } from "../../utils/router-path";
import { loginAuth } from "../../utils/auth/login.auth";
import { getMeAuth } from "../../utils/auth/me.auth";
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

  it("should return a jwt token on successful login; POST /api/auth/login", async () => {
    await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "jwtCreate",
          email: "jwtCreate@example.com",
          password: "securePas",
        },
      },
    }).expect(HttpStatus.Created);

    const loginResponse = await loginAuth({
      loginOrEmail: "jwtCreate",
      password: "securePas",
    }).expect(HttpStatus.Ok);

    expect(typeof loginResponse.body.token).toBe("string");
    expect(loginResponse.body.token.length).toBeGreaterThan(0);
    expect(loginResponse.body.token.split(".")).toHaveLength(3);
  });

  describe("GET /api/auth/me", () => {
    const login = "meUser";
    const email = "meUser@example.com";
    const password = "securePas";

    const createAndLoginUser = async () => {
      const createResponse = await createUser({
        data: {
          ...collectCorrectUser().data,
          attributes: {
            ...collectCorrectUser().data.attributes,
            login,
            email,
            password,
          },
        },
      }).expect(HttpStatus.Created);

      const loginResponse = await loginAuth({
        loginOrEmail: login,
        password,
      }).expect(HttpStatus.Ok);

      return {
        createdUser: createResponse.body.data,
        token: loginResponse.body.token as string,
      };
    };

    it("should return current user info for a valid jwt issued by POST /api/auth/login", async () => {
      const { createdUser, token } = await createAndLoginUser();

      const meResponse = await getMeAuth(token).expect(HttpStatus.Ok);

      expect(meResponse.body).toEqual(
        expect.objectContaining({
          id: createdUser.id,
          attributes: expect.objectContaining({
            email: createdUser.attributes.email,
          }),
        }),
      );
    });

    it("should not return user info without an authorization header", async () => {
      await getMeAuth().expect(HttpStatus.Unauthorized);
    });

    it("should not return user info when the authorization scheme is not Bearer", async () => {
      const { token } = await createAndLoginUser();

      await request(app)
        .get(`${AUTH_ROUTER}/me`)
        .set("Authorization", `Basic ${token}`)
        .expect(HttpStatus.Unauthorized);
    });

    it("should not return user info for a malformed jwt", async () => {
      await getMeAuth("not.a.valid.token").expect(HttpStatus.Unauthorized);
    });

    it("should not return user info for a jwt signed with a different secret", async () => {
      const { createdUser } = await createAndLoginUser();

      const foreignToken = sign(
        { _id: createdUser.id },
        "some-other-secret",
        {
          algorithm: "HS256",
          expiresIn: "1d",
          issuer: "auth.taxi.com",
          audience: "api.taxi.com",
          subject: createdUser.id,
        },
      );

      await getMeAuth(foreignToken).expect(HttpStatus.Unauthorized);
    });

    it("should not return user info for an expired jwt", async () => {
      const { createdUser } = await createAndLoginUser();

      const expiredToken = sign(
        { _id: createdUser.id },
        JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "-1s",
          issuer: "auth.taxi.com",
          audience: "api.taxi.com",
          subject: createdUser.id,
        },
      );

      await getMeAuth(expiredToken).expect(HttpStatus.Unauthorized);
    });
  });
});
