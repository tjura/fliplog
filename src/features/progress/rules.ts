import { skills } from "../catalogue/catalogue.ts";

export type Rating = 1 | 2 | 3 | 4 | 5;
export const ratingOptions: readonly Rating[] = [1, 2, 3, 4, 5];
export const ratingLabels: Record<Rating, string> = {
  1: "Started learning",
  2: "Working on the basics",
  3: "Building consistency",
  4: "Usually consistent",
  5: "Consistent in my practice",
};
export type SavedRating = { rating: Rating | null; updatedAt: string | null };
export type ProgressMap = Record<string, SavedRating>;

export function isRating(value: unknown): value is Rating {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

export function ratingText(rating: Rating | null): string {
  return rating === null
    ? "Not started"
    : `${rating} ${rating === 1 ? "star" : "stars"} — ${ratingLabels[rating]}`;
}

export function parseRatingChange(
  value: unknown,
): { skillId: string; rating: Rating | null } | null {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    return null;
  if (
    Object.keys(value).length !== 2 ||
    !("skillId" in value) ||
    !("rating" in value)
  )
    return null;
  if (
    typeof value.skillId !== "string" ||
    !skills.some((skill) => skill.id === value.skillId)
  )
    return null;
  if (value.rating !== null && !isRating(value.rating)) return null;
  return { skillId: value.skillId, rating: value.rating };
}

export function isSavedRating(value: unknown): value is SavedRating {
  if (
    typeof value !== "object" ||
    value === null ||
    !("rating" in value) ||
    !("updatedAt" in value)
  )
    return false;
  if (value.rating === null) return value.updatedAt === null;
  return (
    isRating(value.rating) &&
    typeof value.updatedAt === "string" &&
    Number.isFinite(Date.parse(value.updatedAt))
  );
}
