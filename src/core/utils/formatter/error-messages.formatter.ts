import { ErrorMessage, ValidationError } from "../../types/validation-error";

export const errorMessagesFormatter = (
  errors: ValidationError[],
): ErrorMessage => ({
  errorMessages: errors,
});
