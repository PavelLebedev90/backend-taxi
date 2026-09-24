import express from "express";
import { setupApp } from "../../src/setup-app";

export const app = express();
setupApp(app);
