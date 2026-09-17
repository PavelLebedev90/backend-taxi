import { DRIVER_ROUTER } from "../router-path";
import { authenticatedRequest as request } from "../../utils/request-auth";
import { DriverInputDto } from "../../../src/drivers/dto/driver.input.dto";

type DriverInputTestDto = {
  [K in keyof DriverInputDto]?: any;
};

export const createDriver = (newDriver: DriverInputTestDto) => {
  return request.post(DRIVER_ROUTER).send(newDriver);
};
