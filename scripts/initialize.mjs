import { getMigrations } from "better-auth/db/migration";
import { openDatabase } from "../src/server/sqlite.ts";
import { authOptions } from "../src/server/auth-config.ts";

const database = openDatabase();
try {
  const { runMigrations } = await getMigrations(authOptions(database));
  await runMigrations();
  database.transaction(() => {
    const version = database.pragma("user_version", { simple: true });
    if (version > 1) throw new Error("Unsupported FLIPLOG database version");
    if (version === 0) {
      database.exec(`CREATE TABLE progress (
        userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
        skillId TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (typeof(rating) = 'integer' AND rating BETWEEN 1 AND 5),
        updatedAt TEXT NOT NULL,
        PRIMARY KEY (userId, skillId)
      )`);
      database.pragma("user_version = 1");
    }
  })();
  console.log("FLIPLOG database initialized");
} finally {
  database.close();
}
