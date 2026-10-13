import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { app } from "../../constants/app-express";

export const registrationEmailResendingAuth = (body: { email?: any }) => {
  return request(app)
    .post(`${AUTH_ROUTER}/registration-email-resending`)
    .send(body);
};
