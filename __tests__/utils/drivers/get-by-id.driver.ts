import { DRIVER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";

export const getByIdDriver = (driverId: string) => {
  return request.get(`${DRIVER_ROUTER}/${driverId}`);
};
