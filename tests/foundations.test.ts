import assert from "node:assert/strict";
import test from "node:test";
import { skills } from "../src/features/catalogue/catalogue.ts";
import {
  foundationReminders,
  visibleSkills,
} from "../src/features/progress/foundations.ts";
import type { ProgressMap } from "../src/features/progress/rules.ts";

const updatedAt = "2026-10-13T00:00:00.000Z";
const backFull = skills.find((skill) => skill.id === "F17");
const airBackflip = skills.find((skill) => skill.id === "F18");
assert.ok(backFull && airBackflip);

test("foundation reminders distinguish guest, missing and the editorial 4+ threshold", () => {
  assert.equal(foundationReminders(backFull, null)[0]?.rating, undefined);
  assert.equal(foundationReminders(backFull, {})[0]?.rating, null);
  for (const [rating, recorded] of [
    [3, false],
    [4, true],
    [5, true],
  ] as const) {
    const reminders = foundationReminders(backFull, {
      F13: { rating, updatedAt },
    });
    assert.equal(
      reminders.find((reminder) => reminder.skill.id === "F13")?.recorded,
      recorded,
    );
  }
});

test("lowering a foundation recomputes context without mutating advanced or other-surface progress", () => {
  const progress: ProgressMap = {
    F13: { rating: 4, updatedAt },
    F17: { rating: 5, updatedAt },
    F11: { rating: 5, updatedAt },
  };
  const original = JSON.stringify(progress);
  assert.equal(
    foundationReminders(backFull, progress).find(
      (reminder) => reminder.skill.id === "F13",
    )?.recorded,
    true,
  );
  const lower: ProgressMap = { ...progress, F13: { rating: 3, updatedAt } };
  assert.equal(
    foundationReminders(backFull, lower).find(
      (reminder) => reminder.skill.id === "F13",
    )?.recorded,
    false,
  );
  assert.equal(lower.F17?.rating, 5);
  assert.equal(JSON.stringify(progress), original);
  assert.equal(
    foundationReminders(airBackflip, progress).some(
      (reminder) => reminder.recorded,
    ),
    false,
  );
});

test("My progress is a surface/group view of current non-null records", () => {
  const progress: ProgressMap = {
    F11: { rating: 1, updatedAt },
    F18: { rating: 2, updatedAt },
  };
  assert.deepEqual(
    visibleSkills("trampoline", "all", true, progress).map((skill) => skill.id),
    ["F11"],
  );
  assert.deepEqual(
    visibleSkills("air-track", "3", true, progress).map((skill) => skill.id),
    ["F18"],
  );
  assert.equal(visibleSkills("air-track", "0", true, progress).length, 0);
  assert.equal(visibleSkills("all", "all", true, {}).length, 0);
});
