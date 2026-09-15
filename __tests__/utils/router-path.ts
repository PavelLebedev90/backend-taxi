import { BASE_ROUTE } from "../../src/core/constants/base.path";
import { DRIVER_ROUTE } from "../../src/core/constants/driversRouter.path";
import { TESTING_ROUTE } from "../../src/core/constants/testingRouter.path";

export const DRIVER_ROUTER = `${BASE_ROUTE}${DRIVER_ROUTE.DRIVERS}`;
const TESTING_ROUTER = `${BASE_ROUTE}${TESTING_ROUTE.TESTING}`;

export const TESTING_ROUTER_ALL = `${TESTING_ROUTER}${TESTING_ROUTE.ALL_DATA}`;
