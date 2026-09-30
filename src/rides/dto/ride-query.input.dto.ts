import { Queries } from "../../core/types/queries";

export enum RideSortFields {
  CreatedAt = "createdAt",
  StartedAt = "startedAt",
  FinishedAt = "finishedAt",
  ClientName = "clientName",
  Price = "price",
}

export type RideQueryInput = Queries<RideSortFields> & {};
