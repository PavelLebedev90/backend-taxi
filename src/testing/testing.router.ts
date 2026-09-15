import { Router } from "express";
import { deleteTesting } from "./handlers/delete-testing";
import { TESTING_ROUTE } from "../core/constants/testing-router.path";

export const testingRouter = Router({});

testingRouter.delete(TESTING_ROUTE.ALL_DATA, deleteTesting);
