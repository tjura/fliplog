import "server-only";
import { openDatabase } from "./sqlite.ts";

let database: ReturnType<typeof openDatabase> | undefined;
export function getDatabase() {
  database ??= openDatabase();
  return database;
}
