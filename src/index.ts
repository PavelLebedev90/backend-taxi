import express, { Express } from "express";
import { setupApp } from "./setup-app";
import { MONGO_URL_DEV, PORT } from "./settings/config";
import { runDB } from "./db/mongo.db";

const app: Express = express();
const bootstrap = async () => {
  setupApp(app);

  // await runDB(MONGO_URL);
  await runDB(MONGO_URL_DEV);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

bootstrap();
export default app;
