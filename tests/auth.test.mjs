import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import test from "node:test";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const origin = process.env.SMOKE_ORIGIN ?? "http://127.0.0.1:3187";
const url = (path) => new URL(`/api/auth/${path}`, baseUrl);
const jsonHeaders = { origin, "content-type": "application/json" };

test("real credentials create a private session and sign-out invalidates it", async () => {
  const email = `smoke-${randomUUID()}@example.test`;
  const password = randomBytes(20).toString("hex");
  const guest = await fetch(url("get-session"));
  assert.equal(guest.status, 200);
  assert.equal((await guest.json()) === null, true);
  const created = await fetch(url("sign-up/email"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password, name: "Learner" }),
  });
  assert.equal(created.status, 200);
  const cookie = created.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert.equal(/fliplog(?:-\d+)?\.session_token=/.test(cookie), true);
  const attributes = created.headers
    .getSetCookie()
    .map((value) => value.slice(value.indexOf(";")))
    .join(";");
  assert.match(attributes, /HttpOnly/i);
  assert.match(attributes, /SameSite=Lax/i);
  const session = await fetch(url("get-session"), { headers: { cookie } });
  const data = await session.json();
  assert.equal(Boolean(data?.session && data?.user?.email === email), true);
  const wrongPassword = await fetch(url("sign-in/email"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password: "incorrect-password" }),
  });
  assert.equal(wrongPassword.status, 401);
  const signedOut = await fetch(url("sign-out"), {
    method: "POST",
    headers: { ...jsonHeaders, cookie },
    body: "{}",
  });
  assert.equal(signedOut.status, 200);
  const stale = await fetch(url("get-session"), { headers: { cookie } });
  assert.equal((await stale.json()) === null, true);
  const invalidOrigin = await fetch(url("sign-in/email"), {
    method: "POST",
    headers: { ...jsonHeaders, origin: "https://untrusted.example" },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(invalidOrigin.status, 403);
  const signedIn = await fetch(url("sign-in/email"), {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password }),
  });
  assert.equal(signedIn.status, 200);
  const finalCookie = signedIn.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  await fetch(url("sign-out"), {
    method: "POST",
    headers: { ...jsonHeaders, cookie: finalCookie },
    body: "{}",
  });
});
