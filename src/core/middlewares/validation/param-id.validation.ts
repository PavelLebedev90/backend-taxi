import { checkSchema } from "express-validator";

export const validationSchemeParamId = checkSchema(
  {
    id: {
      isString: true,
      isMongoId: true,
      isEmpty: { negated: true },
    },
  },
  ["params"],
);
