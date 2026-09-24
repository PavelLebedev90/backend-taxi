import express from "express";
import { setupApp } from "./setup-app";
import { MONGO_URL, PORT } from "./settings/config";
import { runDB } from "./db/mongo.db";

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  await runDB(MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

bootstrap();
