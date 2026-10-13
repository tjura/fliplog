import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { open, rm } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";

// SQLite's online backup includes committed WAL data in one consistent file.
// Keep it private: it contains accounts, password hashes, sessions and progress.
const destination = `/tmp/fliplog-backup-${randomUUID()}.sqlite`;
const reservation = await open(destination, "wx", 0o600);
try {
  await reservation.close();
  const database = new Database(
    process.env.DATABASE_PATH ?? "/data/fliplog.sqlite",
    { readonly: true, fileMustExist: true, timeout: 3000 },
  );
  try {
    await database.backup(destination);
  } finally {
    database.close();
  }
  // Docker cp cannot read tmpfs. Stream only the completed snapshot via exec.
  await pipeline(createReadStream(destination), process.stdout);
} finally {
  await rm(destination, { force: true });
}
