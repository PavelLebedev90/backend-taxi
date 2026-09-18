import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { HttpStatus } from "../../types/http-statuses";
import { errorMessagesFormatter } from "../../utils/formatter/error-messages.formatter";

export const inputResultValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult
    .withDefaults({
      formatter: (error) => {
        return {
          field: error.type === "field" ? error.path : "",
          message: error.msg,
        };
      },
    })(req)
    .array({ onlyFirstError: true });

  if (errors.length) {
    res.status(HttpStatus.BadRequest).send(errorMessagesFormatter(errors));
    return;
  }
  req.body = matchedData(req, { locations: ["body"] });
  next();
};
