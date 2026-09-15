export type ValidationError = {
  field: string;
  message: string;
};

export type ErrorMessage = {
  errorMessages: ValidationError[];
};
