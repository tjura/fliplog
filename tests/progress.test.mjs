import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import test from "node:test";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const origin = process.env.SMOKE_ORIGIN ?? "http://127.0.0.1:3187";
const endpoint = new URL("/api/progress", baseUrl);
const jsonHeaders = { origin, "content-type": "application/json" };

async function createLearner() {
  const response = await fetch(new URL("/api/auth/sign-up/email", baseUrl), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      email: `progress-${randomUUID()}@example.test`,
      password: randomBytes(20).toString("hex"),
      name: "Learner",
    }),
  });
  assert.equal(response.status, 200);
  const user = (await response.json()).user;
  const cookie = response.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  return { cookie, id: user.id };
}
const write = (cookie, body, extraHeaders = {}) =>
  fetch(endpoint, {
    method: "PUT",
    headers: { ...jsonHeaders, cookie, ...extraHeaders },
    body: JSON.stringify(body),
  });
async function read(cookie, userId) {
  const url = new URL(endpoint);
  if (userId) url.searchParams.set("userId", userId);
  const response = await fetch(url, { headers: { cookie } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /private, no-store/);
  return response.json();
}
async function signOut(cookie) {
  const response = await fetch(new URL("/api/auth/sign-out", baseUrl), {
    method: "POST",
    headers: { ...jsonHeaders, cookie },
    body: "{}",
  });
  assert.equal(response.status, 200);
}

test("server identity isolates durable ratings; invalid, repeated and reset requests preserve the contract", async () => {
  assert.equal((await fetch(endpoint)).status, 401);
  assert.equal((await write("", { skillId: "F11", rating: 1 })).status, 401);
  const alice = await createLearner();
  const bob = await createLearner();
  assert.deepEqual(await read(alice.cookie), {});
  for (const rating of [0, 6, 1.5, "3", false])
    assert.equal(
      (await write(alice.cookie, { skillId: "F11", rating })).status,
      422,
    );
  for (const body of [
    { skillId: "F11" },
    { skillId: "missing", rating: 3 },
    { skillId: "F11", rating: 3, userId: bob.id },
  ])
    assert.equal((await write(alice.cookie, body)).status, 422);
  assert.equal(
    (
      await write(
        alice.cookie,
        { skillId: "F11", rating: 3 },
        { origin: "https://untrusted.example" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await write(
        alice.cookie,
        { skillId: "F11", rating: 3 },
        { "content-type": "text/plain" },
      )
    ).status,
    415,
  );
  const malformed = await fetch(endpoint, {
    method: "PUT",
    headers: { ...jsonHeaders, cookie: alice.cookie },
    body: "{",
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await read(alice.cookie), {});

  const firstResponse = await write(alice.cookie, {
    skillId: "F11",
    rating: 5,
  });
  assert.equal(firstResponse.status, 200);
  const first = await firstResponse.json();
  assert.equal(first.rating, 5);
  assert.equal(typeof first.updatedAt, "string");
  const repeated = await write(alice.cookie, { skillId: "F11", rating: 5 });
  assert.equal(repeated.status, 200);
  assert.equal((await repeated.json()).updatedAt, first.updatedAt);
  assert.equal(Object.keys(await read(alice.cookie)).length, 1);
  assert.equal(
    (await write(bob.cookie, { skillId: "F11", rating: 3 })).status,
    200,
  );
  assert.equal((await read(bob.cookie, alice.id)).F11.rating, 3);
  assert.equal((await read(alice.cookie)).F11.rating, 5);
  assert.equal(
    (await write(bob.cookie, { skillId: "F11", rating: 1, userId: alice.id }))
      .status,
    422,
  );
  assert.equal((await read(alice.cookie)).F11.rating, 5);

  assert.equal(
    (await write(alice.cookie, { skillId: "F18", rating: 2 })).status,
    200,
  );
  const surfaces = await read(alice.cookie);
  assert.equal(surfaces.F11.rating, 5);
  assert.equal(surfaces.F18.rating, 2);
  for (let attempt = 0; attempt < 2; attempt++) {
    const reset = await write(alice.cookie, { skillId: "F11", rating: null });
    assert.equal(reset.status, 200);
    assert.deepEqual(await reset.json(), { rating: null, updatedAt: null });
  }
  const afterReset = await read(alice.cookie);
  assert.equal(afterReset.F11, undefined);
  assert.equal(afterReset.F18.rating, 2);
  assert.equal((await read(bob.cookie)).F11.rating, 3);
  await signOut(alice.cookie);
  assert.equal(
    (await fetch(endpoint, { headers: { cookie: alice.cookie } })).status,
    401,
  );
  assert.equal(
    (await write(alice.cookie, { skillId: "F18", rating: 1 })).status,
    401,
  );
  await signOut(bob.cookie);
});
