import { checkSchema } from "express-validator/lib/middlewares/schema";

export const validationSchemeDriverInput = checkSchema(
  {
    name: {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    phoneNumber: {
      isString: true,
      trim: true,
      isLength: { options: { min: 8, max: 15 } },
    },
    email: {
      isString: true,
      trim: true,
      isEmail: true,
      isLength: { options: { min: 5, max: 100 } },
    },
    vehicleMake: {
      isString: true,
      trim: true,
      isLength: { options: { min: 3, max: 100 } },
    },
    vehicleModel: {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 100 } },
    },
    vehicleYear: {
      isInt: { options: { min: 1900, max: new Date().getFullYear() } },
    },
    vehicleLicensePlate: {
      isString: true,
      trim: true,
      isLength: { options: { min: 6, max: 10 } },
    },
    vehicleDescription: {
      isString: true,
      trim: true,
      optional: { options: { nullable: true } },
      isLength: { options: { min: 10, max: 200 } },
    },
    vehicleFeatures: {
      isArray: true,
      isEmpty: { negated: true },
      isIn: { options: [["wi-fi", "child-seat", "pet-friendly"]] },
    },
  },
  ["body"],
);
