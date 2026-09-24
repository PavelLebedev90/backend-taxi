import dotenv from "dotenv";
dotenv.config();

export const BASE_ROUTE = process.env.BASE_ROUTE || "/api";
export const PORT = process.env.PORT || 3000;

export const BASE_AUTH_PREFIX = process.env.BASE_AUTH_PREFIX || "Basic";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "superuser";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "superuser";

export const MONGO_URL =
  process.env.MONGO_URL || "mongodb://0.0.0.0:27017/taxi-dev-db";

export const DB_NAME = process.env.DB_NAME || "Taxi";
