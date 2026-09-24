import { checkSchema } from "express-validator/lib/middlewares/schema";
import { Currency } from "../types/rides.types";

export const validationSchemeRideInput = checkSchema(
  {
    clientName: {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 15 } },
    },
    price: {
      isFloat: { options: { min: 10, max: 150.0 } },
    },
    currency: {
      isString: true,
      trim: true,
      isIn: { options: [[Currency.EUR, Currency.USD]] },
    },
    driverId: {
      isMongoId: { negated: false },
    },
    fromAddress: {
      isString: true,
      trim: true,
      isLength: { options: { min: 5, max: 100 } },
    },
    toAddress: {
      isString: true,
      trim: true,
      isLength: { options: { min: 5, max: 100 } },
    },
  },
  ["body"],
);
