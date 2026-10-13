import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const requestTimeout = Number(process.env.SMOKE_REQUEST_TIMEOUT_MS ?? 10_000);

test("the running server responds with the environment health contract", async () => {
  const response = await fetch(new URL("/health", baseUrl), {
    signal: AbortSignal.timeout(requestTimeout),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
  assert.deepEqual(await response.json(), { status: "ok" });
});

test("the public catalogue renders over HTTP", async () => {
  const response = await fetch(new URL("/", baseUrl), {
    signal: AbortSignal.timeout(requestTimeout),
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  const html = await response.text();
  assert.match(html, /FLIPLOG/);
  assert.match(html, /Every practice/);
  assert.match(html, /Straight jump/);
});

test("an unknown URL is not reported as a successful page", async () => {
  const response = await fetch(new URL("/environment-smoke-missing", baseUrl), {
    signal: AbortSignal.timeout(requestTimeout),
  });
  assert.equal(response.status, 404);
});

test("an unknown skill returns a real 404", async () => {
  const response = await fetch(new URL("/skills/not-a-real-skill", baseUrl), {
    signal: AbortSignal.timeout(requestTimeout),
  });
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Skill not found/);
});
