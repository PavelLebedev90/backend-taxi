import { Router } from "express";
import { inputResultValidationErrors } from "../../core/middlewares/validation/input-result.validation";
import { validationSchemaAuthLoginInputBody } from "../validation/auth-input-body.validation";
import { loginAuth } from "../handlers/login-auth";
import { getMeAuth } from "../handlers/me-auth";
import { AUTH_ROUTE } from "../../core/constants/auth-router.path";

export const authRouter = Router({});

authRouter.get(AUTH_ROUTE.ME, inputResultValidationErrors, getMeAuth);

authRouter.post(
  AUTH_ROUTE.LOGIN,
  validationSchemaAuthLoginInputBody,
  inputResultValidationErrors,
  loginAuth,
);
