import { Router } from "express";
import { createDriver } from "../handlers/createDriver";
import { getDriversList } from "../handlers/getDriversList";
import { getDriver } from "../handlers/getDriver";
import { DRIVER_ROUTE } from "../../core/constants/driversRouter.path";
import { updateDriver } from "../handlers/updateDriver";
import { deleteDriver } from "../handlers/deleteDriver";

export const driversRouter = Router({});

driversRouter.get(DRIVER_ROUTE.ROOT, getDriversList);
driversRouter.get(DRIVER_ROUTE.BY_ID, getDriver);
driversRouter.post(DRIVER_ROUTE.ROOT, createDriver);
driversRouter.put(DRIVER_ROUTE.BY_ID, updateDriver);
driversRouter.delete(DRIVER_ROUTE.BY_ID, deleteDriver);
