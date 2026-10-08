import { checkSchema } from "express-validator/lib/middlewares/schema";
import { ResourceType } from "../../core/types/resource";
import { resourceTypeSchema } from "../../core/middlewares/validation/resource-type.validation";

export const validationSchemaUserInputBody = checkSchema(
  {
    "data.type": {
      ...resourceTypeSchema(ResourceType.Users),
    },
    "data.attributes.firstName": {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    "data.attributes.lastName": {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    "data.attributes.middleName": {
      isString: true,
      trim: true,
      optional: { options: { nullable: true } },
      isLength: { options: { min: 2, max: 15 } },
    },
    "data.attributes.phoneNumber": {
      isString: true,
      trim: true,
      isMobilePhone: { options: "any" },
      isLength: { options: { min: 8, max: 15 } },
    },
    "data.attributes.email": {
      isString: true,
      trim: true,
      isEmail: true,
      toLowerCase: true,
      isLength: { options: { min: 5, max: 100 } },
    },
  },
  ["body"],
);

export const validationSchemaUserRegistrationInputBody = checkSchema(
  {
    "data.attributes.login": {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    "data.attributes.password": {
      isString: true,
      trim: true,
      isLength: { options: { min: 8, max: 15 } },
    },
  },
  ["body"],
);
