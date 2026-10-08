import { checkSchema } from "express-validator/lib/middlewares/schema";

export const validationSchemaAuthLoginInputBody = checkSchema(
  {
    loginOrEmail: {
      isString: true,
      trim: true,
      isLength: { options: { min: 2, max: 100 } },
    },
    password: {
      isString: true,
      trim: true,
      isLength: { options: { min: 8, max: 15 } },
    },
  },
  ["body"],
);
