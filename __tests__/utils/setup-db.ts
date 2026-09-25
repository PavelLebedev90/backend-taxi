import { client, runDB } from "../../src/db/mongo.db";
import { MONGO_URL_DEV } from "../../src/settings/config";
import { clearDB } from "./clear-bb";

export function setupDbLifecycle() {
  beforeAll(async () => {
    await runDB(MONGO_URL_DEV);
  }, 20000);

  beforeEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });
}
