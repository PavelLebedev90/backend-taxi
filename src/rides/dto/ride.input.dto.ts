import { Currency } from "../types/rides.types";

export type RideInputDto = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};
