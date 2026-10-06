import { Router } from "express";
import { getUsersList } from "../handlers/get-users-list";
import { getUser } from "../handlers/get-user";
import { inputResultValidationErrors } from "../../core/middlewares/validation/input-result.validation";
import { validationSchemeParamId } from "../../core/middlewares/validation/param-id.validation";
import {
  validationSchemaUserInputBody,
  validationSchemaUserLoginInputBody,
  validationSchemaUserRegistrationInputBody,
} from "../validation/user-input-body.validation";
import { validationSchemaUserInputQuery } from "../validation/user-input-query.validation";
import { USER_ROUTE } from "../../core/constants/users-router.path";
import { deleteUser } from "../handlers/delete-user";
import { updateUser } from "../handlers/update-user";
import { createUser } from "../handlers/create-user";
import { loginUser } from "../handlers/login-user";

export const usersRouter = Router({});

usersRouter.get(
  USER_ROUTE.ROOT,
  validationSchemaUserInputQuery,
  inputResultValidationErrors,
  getUsersList,
);
usersRouter.get(
  USER_ROUTE.BY_ID,
  validationSchemeParamId,
  inputResultValidationErrors,
  getUser,
);
usersRouter.post(
  USER_ROUTE.ROOT,
  validationSchemaUserRegistrationInputBody,
  validationSchemaUserInputBody,
  inputResultValidationErrors,
  createUser,
);
usersRouter.post(
  USER_ROUTE.LOGIN,
  validationSchemaUserLoginInputBody,
  inputResultValidationErrors,
  loginUser,
);
usersRouter.put(
  USER_ROUTE.BY_ID,
  validationSchemeParamId,
  validationSchemaUserInputBody,
  inputResultValidationErrors,
  updateUser,
);
usersRouter.delete(
  USER_ROUTE.BY_ID,
  validationSchemeParamId,
  inputResultValidationErrors,
  deleteUser,
);
