import assert from "node:assert/strict";
import test from "node:test";
import { authErrorMessage } from "../src/features/auth/error-message.ts";

test("auth feedback separates credentials, rate limits and unavailable service", () => {
  assert.match(authErrorMessage(401, false), /Email or password is incorrect/);
  for (const createAccount of [false, true]) {
    assert.match(
      authErrorMessage(429, createAccount),
      /wait a minute and retry/,
    );
    for (const status of [503, 0, 403]) {
      const message = authErrorMessage(status, createAccount);
      assert.match(message, /temporarily unavailable.*retry/);
      assert.doesNotMatch(message, /email|password|details/i);
    }
  }
  assert.equal(authErrorMessage(409, true), authErrorMessage(400, true));
  assert.match(
    authErrorMessage(409, true),
    /Check your details or try signing in/,
  );
});
