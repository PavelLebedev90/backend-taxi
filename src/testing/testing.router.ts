import { Router } from "express";
import { deleteTesting } from "./handlers/deleteTesting";
import { TESTING_ROUTE } from "../core/constants/testingRouter.path";

export const testingRouter = Router({});

testingRouter.delete(TESTING_ROUTE.ALL_DATA, deleteTesting);
