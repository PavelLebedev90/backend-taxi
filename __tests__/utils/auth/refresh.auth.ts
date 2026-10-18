import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { app } from "../../constants/app-express";

export const refreshAuth = (refreshCookie?: string) => {
  const req = request(app).post(`${AUTH_ROUTER}/refresh-token`);
  if (refreshCookie) {
    req.set("Cookie", [refreshCookie]);
  }
  return req;
};
