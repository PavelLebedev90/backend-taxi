import { RIDE_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";

export const finishRide = (id: string, finishedAt: Date) => {
  return request.put(`${RIDE_ROUTER}/${id}/actions/finish`).send(finishedAt);
};
