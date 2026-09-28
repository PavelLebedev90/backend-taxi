import { Router } from "express";
import { createDriver } from "../handlers/create-driver";
import { getDriversList } from "../handlers/get-drivers-list";
import { getDriver } from "../handlers/get-driver";
import { DRIVER_ROUTE } from "../../core/constants/drivers-router.path";
import { updateDriver } from "../handlers/update-driver";
import { deleteDriver } from "../handlers/delete-driver";
import { inputResultValidationErrors } from "../../core/middlewares/validation/input-result.validation";
import { validationSchemeParamId } from "../../core/middlewares/validation/param-id.validation";
import { validationSchemaDriverInputBody } from "../validation/driver-input-body.validation";
import { superAdminAuth } from "../../core/middlewares/auth/super-admin.auth";
import { validationSchemaDriverInputQuery } from "../validation/driver-input-query.validation";

export const driversRouter = Router({});

driversRouter.use(superAdminAuth);
driversRouter.get(
  DRIVER_ROUTE.ROOT,
  validationSchemaDriverInputQuery,
  inputResultValidationErrors,
  getDriversList,
);
driversRouter.get(
  DRIVER_ROUTE.BY_ID,
  validationSchemeParamId,
  inputResultValidationErrors,
  getDriver,
);
driversRouter.post(
  DRIVER_ROUTE.ROOT,
  validationSchemaDriverInputBody,
  inputResultValidationErrors,
  createDriver,
);
driversRouter.put(
  DRIVER_ROUTE.BY_ID,
  validationSchemeParamId,
  validationSchemaDriverInputBody,
  inputResultValidationErrors,
  updateDriver,
);
driversRouter.delete(
  DRIVER_ROUTE.BY_ID,
  validationSchemeParamId,
  inputResultValidationErrors,
  deleteDriver,
);
