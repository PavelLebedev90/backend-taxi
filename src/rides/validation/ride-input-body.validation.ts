import { checkSchema } from "express-validator/lib/middlewares/schema";
import { Currency } from "../types/rides.types";
import { ResourceType } from "../../core/types/resource";
import { resourceTypeSchema } from "../../core/middlewares/validation/resource-type.validation";

export const validationSchemaRideInputBody = checkSchema(
  {
    "data.type": {
      ...resourceTypeSchema(ResourceType.Rides),
    },
    "data.attributes.clientName": {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    "data.attributes.price": {
      isFloat: { options: { min: 10, max: 150.0 } },
    },
    "data.attributes.currency": {
      isString: true,
      trim: true,
      isIn: { options: [[Currency.EUR, Currency.USD]] },
    },
    "data.attributes.driverId": {
      isMongoId: { negated: false },
    },
    "data.attributes.fromAddress": {
      isString: true,
      trim: true,
      isLength: { options: { min: 5, max: 100 } },
    },
    "data.attributes.toAddress": {
      isString: true,
      trim: true,
      isLength: { options: { min: 5, max: 100 } },
    },
  },
  ["body"],
);
