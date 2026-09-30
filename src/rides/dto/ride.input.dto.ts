import { ResourceType } from "../../core/types/resource";
import { Currency } from "../types/rides.types";

export type RideInputDto = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};

export type RideCreateInput = {
  data: {
    type: ResourceType.Rides;
    attributes: RideInputDto;
  };
};

export type RideUpdateInput = {
  data: {
    type: ResourceType.Rides;
    id: string;
    attributes: RideInputDto;
  };
};
