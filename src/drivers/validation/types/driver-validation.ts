export type DriverStringValidation = {
  type: "string";
  required: boolean;
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
};

export type DriverNumberValidation = {
  type: "number";
  required: boolean;
  min: number;
  max: number;
};

export type DriverArrayValidation<T> = {
  type: "array";
  required: boolean;
  items?: Set<T>;
};

export type DriverValidation<T> =
  DriverStringValidation | DriverNumberValidation | DriverArrayValidation<T>;
