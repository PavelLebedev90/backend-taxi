import { checkSchema } from "express-validator";

export const validationSchemeParamId = checkSchema(
  {
    id: {
      isString: true,
      isNumeric: true,
      isEmpty: { negated: true },
    },
  },
  ["params"],
);
