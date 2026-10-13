import assert from "node:assert/strict";
import test from "node:test";
import {
  parseRatingChange,
  ratingText,
  ratingOptions,
} from "../src/features/progress/rules.ts";

test("null is outside the five ratings and 1 means learning, never an implicit default", () => {
  assert.equal(ratingText(null), "Not started");
  assert.equal(ratingText(1), "1 star — Started learning");
  for (const rating of ratingOptions)
    assert.deepEqual(parseRatingChange({ skillId: "F11", rating }), {
      skillId: "F11",
      rating,
    });
  assert.deepEqual(parseRatingChange({ skillId: "F11", rating: null }), {
    skillId: "F11",
    rating: null,
  });
});

test("the mutation boundary rejects invalid ratings, missing values and forged ownership", () => {
  for (const rating of [0, 6, 2.5, "3", false, undefined])
    assert.equal(parseRatingChange({ skillId: "F11", rating }), null);
  for (const input of [
    { skillId: "F11" },
    { skillId: "missing", rating: 3 },
    { skillId: "F11", rating: 3, userId: "another-user" },
    {},
    [],
    null,
  ])
    assert.equal(parseRatingChange(input), null);
});
