import { Db, MongoClient } from "mongodb";
import os from "node:os";
import { initCollections } from "./collections";
import { DB_NAME } from "../settings/config";

export let client: MongoClient;

// Подключение к БД
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, { runtimeAdapters: { os } });
  const db: Db = client.db(DB_NAME);

  // Инициализируем коллекции из подключённой базы.
  initCollections(db);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
