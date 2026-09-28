import { Router } from "express";
import { RIDE_ROUTE } from "../../core/constants/rides-router.path";
import { validationSchemeParamId } from "../../core/middlewares/validation/param-id.validation";
import { inputResultValidationErrors } from "../../core/middlewares/validation/input-result.validation";
import { getRidesList } from "../handlers/get-rides-list";
import { getRide } from "../handlers/get-ride";
import { createRide } from "../handlers/create-ride";
import { validationSchemaRideInputBody } from "../validation/ride-input-body.validation";
import { superAdminAuth } from "../../core/middlewares/auth/super-admin.auth";
import { finishRide } from "../handlers/finish-ride";
import { validationSchemaRideInputQuery } from "../validation/ride-input-query.validation";

export const ridesRouter = Router({});

ridesRouter.use(superAdminAuth);
ridesRouter.get(
  RIDE_ROUTE.ROOT,
  validationSchemaRideInputQuery,
  inputResultValidationErrors,
  getRidesList,
);
ridesRouter.get(
  RIDE_ROUTE.BY_ID,
  validationSchemeParamId,
  inputResultValidationErrors,
  getRide,
);
ridesRouter.post(
  RIDE_ROUTE.ROOT,
  validationSchemaRideInputBody,
  inputResultValidationErrors,
  createRide,
);

ridesRouter.put(
  RIDE_ROUTE.FINISH,
  validationSchemeParamId,
  inputResultValidationErrors,
  finishRide,
);
