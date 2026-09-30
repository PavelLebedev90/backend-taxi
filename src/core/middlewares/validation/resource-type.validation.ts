import { ParamSchema } from "express-validator";
import { ResourceType } from "../../types/resource";

export const resourceTypeSchema = (type: ResourceType): ParamSchema => ({
  isString: true,
  trim: true,
  isLength: { options: { min: 1 } },
  equals: {
    options: type,
  },
});
