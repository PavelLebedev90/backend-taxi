import { Router } from "express";
import { RIDE_ROUTE } from "../../core/constants/rides-router.path";
import { validationSchemeParamId } from "../../core/middlewares/validation/param-id.validation";
import { inputResultValidationErrors } from "../../core/middlewares/validation/input-result.validation";
import { getRidesList } from "../handlers/get-rides-list";
import { getRide } from "../handlers/get-ride";
import { createRide } from "../handlers/create-ride";
import { validationSchemeRideInput } from "../validation/ride-input-dto.validation";
import { superAdminAuth } from "../../core/middlewares/auth/super-admin.auth";

export const ridesRouter = Router({});

ridesRouter.use(superAdminAuth);
ridesRouter.get(RIDE_ROUTE.ROOT, getRidesList);
ridesRouter.get(
  RIDE_ROUTE.BY_ID,
  validationSchemeParamId,
  inputResultValidationErrors,
  getRide,
);
ridesRouter.post(
  RIDE_ROUTE.ROOT,
  validationSchemeRideInput,
  inputResultValidationErrors,
  createRide,
);
