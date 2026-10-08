import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { app } from "../../constants/app-express";

export const getMeAuth = (token?: string) => {
  const req = request(app).get(`${AUTH_ROUTER}/me`);
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }
  return req;
};
