import { Currency } from "../types/rides.types";

export type RideInputDto = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: number;
  fromAddress: string;
  toAddress: string;
};
