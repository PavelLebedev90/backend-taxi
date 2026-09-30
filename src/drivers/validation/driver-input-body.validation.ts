import { checkSchema } from "express-validator/lib/middlewares/schema";
import { ResourceType } from "../../core/types/resource";
import { resourceTypeSchema } from "../../core/middlewares/validation/resource-type.validation";

export const validationSchemaDriverInputBody = checkSchema(
  {
    "data.type": {
      ...resourceTypeSchema(ResourceType.Drivers),
    },
    "data.attributes.name": {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    "data.attributes.phoneNumber": {
      isString: true,
      trim: true,
      isLength: { options: { min: 8, max: 15 } },
    },
    "data.attributes.email": {
      isString: true,
      trim: true,
      isEmail: true,
      isLength: { options: { min: 5, max: 100 } },
    },
    "data.attributes.vehicleMake": {
      isString: true,
      trim: true,
      isLength: { options: { min: 3, max: 100 } },
    },
    "data.attributes.vehicleModel": {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 100 } },
    },
    "data.attributes.vehicleYear": {
      isInt: { options: { min: 1900, max: new Date().getFullYear() } },
    },
    "data.attributes.vehicleLicensePlate": {
      isString: true,
      trim: true,
      isLength: { options: { min: 6, max: 10 } },
    },
    "data.attributes.vehicleDescription": {
      isString: true,
      trim: true,
      optional: { options: { nullable: true } },
      isLength: { options: { min: 10, max: 200 } },
    },
    "data.attributes.vehicleFeatures": {
      isArray: true,
      isEmpty: { negated: true },
      isIn: { options: [["wi-fi", "child-seat", "pet-friendly"]] },
    },
  },
  ["body"],
);
