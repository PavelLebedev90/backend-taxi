import { HttpStatus } from "../../src/core/types/http-statuses";
import { authenticatedRequest as request } from "../utils/request-auth";
import { TESTING_ROUTER_ALL } from "./router-path";

export const clearDB = async () => {
  return await request.delete(TESTING_ROUTER_ALL).expect(HttpStatus.NoContent);
};
