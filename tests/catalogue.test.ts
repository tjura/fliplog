import assert from "node:assert/strict";
import test from "node:test";
import {
  skills,
  validateCatalogue,
  returnPath,
  type Skill,
} from "../src/features/catalogue/catalogue.ts";

test("catalogue identities cover four groups and two separate surfaces", () => {
  assert.equal(skills.length, 20);
  assert.deepEqual(
    [0, 1, 2, 3].map((group) => skills.filter((s) => s.group === group).length),
    [5, 5, 5, 5],
  );
  assert.equal(skills.filter((s) => s.surface === "trampoline").length, 10);
  assert.equal(skills.filter((s) => s.surface === "air-track").length, 10);
  assert.doesNotThrow(() => validateCatalogue(skills));
});

test("invalid foundation graphs fail instead of rendering misleading context", () => {
  const first = skills[0];
  const second = skills[1];
  const air = skills[2];
  assert.ok(first && second && air);
  const replaceFirst = (change: Partial<Skill>) => [
    { ...first, ...change },
    ...skills.slice(1),
  ];
  for (const foundations of [
    ["missing"],
    [first.id],
    [air.id],
    [second.id],
    [second.id, second.id],
  ]) {
    assert.throws(() => validateCatalogue(replaceFirst({ foundations })));
  }
  assert.throws(() => validateCatalogue([...skills, first]));
});

test("auth and detail return paths keep valid filters and reject external navigation", () => {
  assert.equal(
    returnPath("/?surface=air-track&group=0&unexpected=yes"),
    "/?surface=air-track&group=0",
  );
  assert.equal(
    returnPath("/skills/trampoline-backflip-tuck"),
    "/skills/trampoline-backflip-tuck",
  );
  const filteredDetail =
    "/skills/air-track-cartwheel?from=%2F%3Fsurface%3Dair-track%26group%3D0";
  assert.equal(returnPath(filteredDetail), filteredDetail);
  for (const path of [
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/sign-in",
    "/skills/missing",
    undefined,
  ])
    assert.equal(returnPath(path), "/");
});
