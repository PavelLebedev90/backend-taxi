import { DRIVER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";

export const deleteDriver = (driverId: string) => {
  return request.delete(`${DRIVER_ROUTER}/${driverId}`);
};
