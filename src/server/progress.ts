import "server-only";
import { getDatabase } from "./database";
import {
  isSavedRating,
  type ProgressMap,
  type Rating,
  type SavedRating,
} from "../features/progress/rules.ts";

type ProgressRow = { skillId: string; rating: number; updatedAt: string };

export function readProgress(userId: string): ProgressMap {
  const rows = getDatabase()
    .prepare<[string], ProgressRow>(
      "SELECT skillId, rating, updatedAt FROM progress WHERE userId = ?",
    )
    .all(userId);
  const progress: ProgressMap = {};
  for (const row of rows) {
    if (!isSavedRating(row)) throw new Error("Invalid stored progress");
    progress[row.skillId] = { rating: row.rating, updatedAt: row.updatedAt };
  }
  return progress;
}

export function writeRating(
  userId: string,
  skillId: string,
  rating: Rating | null,
): SavedRating {
  const database = getDatabase();
  return database.transaction(() => {
    if (rating === null)
      database
        .prepare("DELETE FROM progress WHERE userId = ? AND skillId = ?")
        .run(userId, skillId);
    else
      database
        .prepare(
          `INSERT INTO progress (userId, skillId, rating, updatedAt) VALUES (?, ?, ?, ?)
      ON CONFLICT(userId, skillId) DO UPDATE SET rating = excluded.rating, updatedAt = excluded.updatedAt
      WHERE progress.rating <> excluded.rating`,
        )
        .run(userId, skillId, rating, new Date().toISOString());
    const saved = database
      .prepare<[string, string], ProgressRow>(
        "SELECT skillId, rating, updatedAt FROM progress WHERE userId = ? AND skillId = ?",
      )
      .get(userId, skillId);
    if (!saved) return { rating: null, updatedAt: null };
    if (!isSavedRating(saved)) throw new Error("Invalid stored progress");
    return { rating: saved.rating, updatedAt: saved.updatedAt };
  })();
}
