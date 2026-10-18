import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { app } from "../../constants/app-express";

export const logoutAuth = (token?: string, refreshCookie?: string) => {
  const req = request(app).post(`${AUTH_ROUTER}/logout`);
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }
  if (refreshCookie) {
    req.set("Cookie", [refreshCookie]);
  }
  return req;
};
