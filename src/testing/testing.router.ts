import { Router } from "express";
import { db } from "../db/drivers-db";
import { HttpStatus } from "../core/types/http-statuses";

export const testingRouter = Router({});

testingRouter.delete("/all-data", (req, res) => {
  db.drivers = [];
  res.sendStatus(HttpStatus.NoContent);
});
