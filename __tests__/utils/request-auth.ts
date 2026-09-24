import request from "supertest";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  BASE_AUTH_PREFIX,
} from "../../src/settings/config";
import { app } from "../constants/app-express";

const AUTH_CREDENTIALS = Buffer.from(
  `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`,
  "utf-8",
).toString("base64");
export const AUTH_HEADER = `${BASE_AUTH_PREFIX} ${AUTH_CREDENTIALS}`;

export const authenticatedRequest = {
  get: (url: string) => request(app).get(url).set("Authorization", AUTH_HEADER),
  post: (url: string) =>
    request(app).post(url).set("Authorization", AUTH_HEADER),
  put: (url: string) => request(app).put(url).set("Authorization", AUTH_HEADER),
  delete: (url: string) =>
    request(app).delete(url).set("Authorization", AUTH_HEADER),
};
