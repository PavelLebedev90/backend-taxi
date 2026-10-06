import { checkSchema } from "express-validator";
import { SortDirection } from "../../core/types/queries";
import { UserSortFields } from "../dto/user-query.input.dto";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.DESC;

export const validationSchemaUserInputQuery = checkSchema(
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
      default: { options: UserSortFields["CreatedAt"] },
      isIn: { options: [Object.values(UserSortFields)] },
    },
    sortDirection: {
      default: { options: DEFAULT_SORT_DIRECTION },
      isIn: { options: [Object.values(SortDirection)] },
    },
    searchUserFullNameTerm: {
      isString: true,
      trim: true,
      optional: { options: { values: undefined } },
      isLength: { options: { min: 2, max: 50 } },
    },
    searchUserEmailTerm: {
      isString: true,
      trim: true,
      optional: { options: { values: undefined } },
      isLength: { options: { min: 2, max: 50 } },
    },
  },
  ["query"],
);
