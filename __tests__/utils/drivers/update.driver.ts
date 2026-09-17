import { DRIVER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { Driver } from "../../../src/drivers/types/driver.types";

export const updateDriver = (driverId: number, updatedDriver: Driver) => {
  return request.put(`${DRIVER_ROUTER}/${driverId}`).send(updatedDriver);
};
