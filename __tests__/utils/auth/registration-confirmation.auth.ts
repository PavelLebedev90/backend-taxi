import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { app } from "../../constants/app-express";

export const registrationConfirmationAuth = (body: {
  emailConfirmationCode?: any;
}) => {
  return request(app)
    .post(`${AUTH_ROUTER}/registration-confirmation`)
    .send(body);
};
