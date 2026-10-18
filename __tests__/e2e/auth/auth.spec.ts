import request from "supertest";
import { sign } from "jsonwebtoken";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { JWT_SECRET } from "../../../src/settings/config";
import { app } from "../../constants/app-express";
import { AUTH_ROUTER } from "../../utils/router-path";
import { loginAuth } from "../../utils/auth/login.auth";
import { getMeAuth } from "../../utils/auth/me.auth";
import { logoutAuth } from "../../utils/auth/logout.auth";
import { refreshAuth } from "../../utils/auth/refresh.auth";
import { setupDbLifecycle } from "../../utils/setup-db";
import { collectCorrectUser } from "../../utils/users/collect-correct.user";
import { createUser } from "../../utils/users/create.user";

const extractRefreshCookie = (response: request.Response): string => {
  const setCookieHeader = response.headers["set-cookie"] as unknown as
    | string[]
    | undefined;
  const refreshCookie = setCookieHeader?.find((cookie) =>
    cookie.startsWith("refreshToken="),
  );
  if (!refreshCookie) {
    throw new Error("refreshToken cookie was not set");
  }
  return refreshCookie.split(";")[0];
};

const createAndLoginUser = async (
  login: string,
  email: string,
  password = "securePas",
) => {
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
    refreshCookie: extractRefreshCookie(loginResponse),
  };
};

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

  it("should set an httpOnly refreshToken cookie on successful login; POST /api/auth/login", async () => {
    await createUser({
      data: {
        ...collectCorrectUser().data,
        attributes: {
          ...collectCorrectUser().data.attributes,
          login: "cookieCreate",
          email: "cookieCreate@example.com",
          password: "securePas",
        },
      },
    }).expect(HttpStatus.Created);

    const loginResponse = await loginAuth({
      loginOrEmail: "cookieCreate",
      password: "securePas",
    }).expect(HttpStatus.Ok);

    const refreshCookie = extractRefreshCookie(loginResponse);
    expect(refreshCookie).toMatch(/^refreshToken=.+/);

    const rawCookieHeader = (
      loginResponse.headers["set-cookie"] as unknown as string[]
    ).find((cookie) => cookie.startsWith("refreshToken="))!;
    expect(rawCookieHeader).toContain("HttpOnly");
    expect(rawCookieHeader).toContain("Path=/api/auth");
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

    it("should return the user as a plain resource object, not wrapped in a data envelope", async () => {
      const { createdUser, token } = await createAndLoginUser();

      const meResponse = await getMeAuth(token).expect(HttpStatus.Ok);

      expect(meResponse.body).not.toHaveProperty("data");
      expect(meResponse.body).toEqual({
        type: createdUser.type,
        id: createdUser.id,
        attributes: {
          firstName: createdUser.attributes.firstName,
          lastName: createdUser.attributes.lastName,
          middleName: createdUser.attributes.middleName,
          phoneNumber: createdUser.attributes.phoneNumber,
          email: createdUser.attributes.email,
          createdAt: createdUser.attributes.createdAt,
          emailConfirmation: expect.objectContaining({
            isConfirmed: expect.any(Boolean),
            confirmationCode: null,
          }),
        },
      });
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

  describe("POST /api/auth/refresh-token", () => {
    it("should issue a new access token and rotate the refresh token cookie", async () => {
      const { refreshCookie } = await createAndLoginUser(
        "refreshUser",
        "refreshUser@example.com",
      );

      const refreshResponse = await refreshAuth(refreshCookie).expect(
        HttpStatus.Ok,
      );

      expect(typeof refreshResponse.body.token).toBe("string");
      expect(refreshResponse.body.token.split(".")).toHaveLength(3);

      const newRefreshCookie = extractRefreshCookie(refreshResponse);
      expect(newRefreshCookie).toMatch(/^refreshToken=.+/);

      // Старый refresh-токен теперь в черном списке и не может быть переиспользован.
      await refreshAuth(refreshCookie).expect(HttpStatus.Unauthorized);
    });

    it("should allow getting /me with the access token issued by refresh", async () => {
      const { createdUser, refreshCookie } = await createAndLoginUser(
        "refreshMeUser",
        "refreshMeUser@example.com",
      );

      const refreshResponse = await refreshAuth(refreshCookie).expect(
        HttpStatus.Ok,
      );

      const meResponse = await getMeAuth(refreshResponse.body.token).expect(
        HttpStatus.Ok,
      );

      expect(meResponse.body).toEqual(
        expect.objectContaining({ id: createdUser.id }),
      );
    });

    it("should not reissue tokens without a refresh token cookie", async () => {
      await refreshAuth().expect(HttpStatus.Unauthorized);
    });

    it("should not reissue tokens for a malformed refresh token", async () => {
      await refreshAuth("refreshToken=not.a.valid.token").expect(
        HttpStatus.Unauthorized,
      );
    });

    it("should not reuse an already rotated (blacklisted) refresh token", async () => {
      const { refreshCookie } = await createAndLoginUser(
        "refreshReuse",
        "refreshReuse@example.com",
      );

      await refreshAuth(refreshCookie).expect(HttpStatus.Ok);

      await refreshAuth(refreshCookie).expect(HttpStatus.Unauthorized);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should log out and clear the refresh token cookie", async () => {
      const { token, refreshCookie } = await createAndLoginUser(
        "logoutUser",
        "logoutUser@example.com",
      );

      const logoutResponse = await logoutAuth(token, refreshCookie).expect(
        HttpStatus.NoContent,
      );

      const clearedCookie = (
        logoutResponse.headers["set-cookie"] as unknown as string[]
      )?.find((cookie) => cookie.startsWith("refreshToken="));
      expect(clearedCookie).toBeDefined();
      expect(clearedCookie).toMatch(/refreshToken=;/);
    });

    it("should blacklist the refresh token so it can no longer be used to refresh", async () => {
      const { token, refreshCookie } = await createAndLoginUser(
        "logoutBlist",
        "logoutBlist@example.com",
      );

      await logoutAuth(token, refreshCookie).expect(HttpStatus.NoContent);

      await refreshAuth(refreshCookie).expect(HttpStatus.Unauthorized);
    });

    it("should not log out without a valid access token", async () => {
      const { refreshCookie } = await createAndLoginUser(
        "logoutNoAccess",
        "logoutNoAccess@example.com",
      );

      await logoutAuth(undefined, refreshCookie).expect(
        HttpStatus.Unauthorized,
      );
    });

    it("should not log out without a refresh token cookie", async () => {
      const { token } = await createAndLoginUser(
        "logoutNoRefresh",
        "logoutNoRefresh@example.com",
      );

      await logoutAuth(token).expect(HttpStatus.Unauthorized);
    });
  });
});
