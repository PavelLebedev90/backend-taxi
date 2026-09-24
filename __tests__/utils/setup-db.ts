import { client, runDB } from "../../src/db/mongo.db";
import { MONGO_URL } from "../../src/settings/config";
import { clearDB } from "./clear-bb";

export function setupDbLifecycle() {
  beforeAll(async () => {
    await runDB(MONGO_URL);
  });

  beforeEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });
}
