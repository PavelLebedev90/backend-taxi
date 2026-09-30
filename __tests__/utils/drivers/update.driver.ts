import { DRIVER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { DriverUpdateInput } from "../../../src/drivers/dto/driver.input.dto";

export const updateDriver = (
  driverId: string,
  updatedDriver: DriverUpdateInput,
) => {
  return request.put(`${DRIVER_ROUTER}/${driverId}`).send(updatedDriver);
};
