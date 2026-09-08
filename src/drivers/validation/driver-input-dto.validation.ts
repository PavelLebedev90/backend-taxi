import { ValidationError } from "../../core/types/validation-error";
import { DriverInputDto } from "../dto/driver.input.dto";
import { VehicleFeature } from "../types/driver";
import {
  DriverArrayValidation,
  DriverNumberValidation,
  DriverStringValidation,
  DriverValidation,
} from "./types/driver-validation";

const validationSchema: Record<string, DriverValidation<VehicleFeature>> = {
  name: {
    type: "string",
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  phoneNumber: {
    type: "string",
    required: true,
    minLength: 8,
    maxLength: 15,
  },
  email: {
    type: "string",
    required: true,
    pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
    minLength: 5,
    maxLength: 100,
  },
  vehicleMake: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  vehicleModel: {
    type: "string",
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  vehicleYear: {
    type: "number",
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
  vehicleLicensePlate: {
    type: "string",
    required: true,
    minLength: 6,
    maxLength: 10,
  },
  vehicleDescription: {
    type: "string",
    required: false,
    minLength: 10,
    maxLength: 200,
  },
  vehicleFeatures: {
    type: "array",
    required: false,
    items: new Set(Object.values(VehicleFeature)),
  },
};

const isInvalidString = (rules: DriverStringValidation, value: unknown) => {
  if (rules.required && (!value || typeof value !== "string")) {
    return true;
  }
  if (!rules.required && (value === null || value === undefined)) {
    return false;
  }

  if (
    typeof value === "string" &&
    (value.trim().length < rules.minLength ||
      value.trim().length > rules.maxLength)
  ) {
    return true;
  }

  if (rules.pattern && !rules.pattern.test(value as string)) {
    return true;
  }
  return false;
};

const isInvalidNumber = (rules: DriverNumberValidation, value: unknown) => {
  if (rules.required && (!value || typeof value !== "number")) {
    return true;
  }
  if (!rules.required && (value === null || value === undefined)) {
    return false;
  }
  if (typeof value === "number" && (value < rules.min || value > rules.max)) {
    return true;
  }

  return false;
};

const isInvalidArray = (
  rules: DriverArrayValidation<VehicleFeature>,
  value: unknown,
) => {
  if (
    rules.required &&
    (!value || !Array.isArray(value) || value.length === 0)
  ) {
    return true;
  }
  if (!rules.required && Array.isArray(value) && value.length === 0) {
    return false;
  }
  if (!Array.isArray(value)) {
    return true;
  }
  if (Array.isArray(value) && rules.items) {
    for (const item of value) {
      const currentItem = item as VehicleFeature;
      if (!rules.items.has(currentItem)) {
        return true;
      }
    }
  }

  return false;
};

export const validateDriverInputDto = (data: DriverInputDto) => {
  const errors: ValidationError[] = [];

  for (const field in validationSchema) {
    const rules = validationSchema[field as keyof typeof validationSchema];
    const value = data[field as keyof DriverInputDto];

    if (rules.type === "string" && isInvalidString(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
    if (rules.type === "number" && isInvalidNumber(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
    if (rules.type === "array" && isInvalidArray(rules, value)) {
      errors.push({ field, message: `Invalid value for ${field}` });
    }
  }
  return errors;
};
