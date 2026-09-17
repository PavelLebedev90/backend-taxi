import { RIDE_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";

export const getByIdRide = (rideId: number) => {
  return request.get(`${RIDE_ROUTER}/${rideId}`);
};
