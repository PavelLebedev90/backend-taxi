import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { AuthLoginInput } from "../../../src/auth/dto/user.input.dto";
import { app } from "../../constants/app-express";

type AuthInputTestDto = {
  [K in keyof AuthLoginInput]?: any;
};

export const loginAuth = (loginAuth: AuthInputTestDto) => {
  return request(app).post(`${AUTH_ROUTER}/login`).send(loginAuth);
};
