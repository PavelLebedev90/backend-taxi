import { AUTH_ROUTER } from "../router-path";
import request from "supertest";
import { UserCreateInput } from "../../../src/users/dto/user.input.dto";
import { app } from "../../constants/app-express";

type UserInputTestDto = {
  [K in keyof UserCreateInput]?: any;
};

export const registrationAuth = (newUser: UserInputTestDto) => {
  return request(app).post(`${AUTH_ROUTER}/registration`).send(newUser);
};
