import { checkSchema } from "express-validator";
import { SortDirection } from "../../core/types/queries";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

const allowedSortFields = [
  "clientName",
  "price",
  "createdAt",
  "startedAt",
  "finishedAt",
];

export const validationSchemaRideInputQuery = checkSchema(
  {
    pageNumber: {
      default: { options: DEFAULT_PAGE_NUMBER },
      isInt: { options: { min: 1 } },
      toInt: true,
    },
    pageSize: {
      default: { options: DEFAULT_PAGE_SIZE },
      isInt: { options: { min: 1, max: 100 } },
      toInt: true,
    },
    sortBy: {
      default: { options: allowedSortFields[0] },
      isIn: { options: [allowedSortFields] },
    },
    sortDirection: {
      default: { options: DEFAULT_SORT_DIRECTION },
      isIn: { options: [Object.values(SortDirection)] },
    },
  },
  ["query"],
);
