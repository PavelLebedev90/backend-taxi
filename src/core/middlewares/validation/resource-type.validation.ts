import { ResourceType } from "../../types/resource";

export const resourceTypeSchema = (type: ResourceType) => ({
  type: {
    isString: true,
    trim: true,
    isLength: { options: { min: 1 } },
    equals: {
      options: type,
    },
  },
});
