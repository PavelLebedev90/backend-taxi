import { RIDE_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { RideInputDto } from "../../../src/rides/dto/ride.input.dto";

type RideInputTestDto = {
  [K in keyof RideInputDto]?: any;
};

export const createRide = (newRide: RideInputTestDto) => {
  return request.post(RIDE_ROUTER).send(newRide);
};
