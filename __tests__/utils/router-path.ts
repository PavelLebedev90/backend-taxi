import { DRIVER_ROUTE } from "../../src/core/constants/drivers-router.path";
import { RIDE_ROUTE } from "../../src/core/constants/rides-router.path";
import { TESTING_ROUTE } from "../../src/core/constants/testing-router.path";
import { USER_ROUTE } from "../../src/core/constants/users-router.path";
import { BASE_ROUTE } from "../../src/settings/config";

export const DRIVER_ROUTER = `${BASE_ROUTE}${DRIVER_ROUTE.DRIVERS}`;
export const RIDE_ROUTER = `${BASE_ROUTE}${RIDE_ROUTE.RIDES}`;
export const USER_ROUTER = `${BASE_ROUTE}${USER_ROUTE.USERS}`;
const TESTING_ROUTER = `${BASE_ROUTE}${TESTING_ROUTE.TESTING}`;

export const TESTING_ROUTER_ALL = `${TESTING_ROUTER}${TESTING_ROUTE.ALL_DATA}`;
