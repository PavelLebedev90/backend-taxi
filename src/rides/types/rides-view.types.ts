import { PaginatedView } from "../../core/types/queries";
import { ResourceType } from "../../core/types/resource";
import { Currency } from "./rides.types";

export type RideView = {
  type: ResourceType.Rides;
  id: string;
  attributes: {
    clientName: string;
    driver: {
      id: string;
      name: string;
    };
    vehicle: {
      licensePlate: string;
      name: string;
    };
    price: number;
    currency: Currency;
    startedAt: Date | null;
    finishedAt: Date | null;
    addresses: {
      from: string;
      to: string;
    };
  };
};

export type RideDataView = {
  data: RideView;
};

export type RideMetaView = {
  meta: PaginatedView;
  data: RideView[];
};
