import Database from "better-sqlite3";

export function openDatabase() {
  const database = new Database(
    process.env.DATABASE_PATH ?? "/data/fliplog.sqlite",
    { timeout: 3000 },
  );
  database.pragma("foreign_keys = ON");
  database.pragma("journal_mode = WAL");
  return database;
}
