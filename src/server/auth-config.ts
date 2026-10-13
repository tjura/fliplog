import type { BetterAuthOptions } from "better-auth";
import type Database from "better-sqlite3";

export function authOptions(database: Database.Database): BetterAuthOptions {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32 || !baseURL)
    throw new Error(
      "Configure BETTER_AUTH_SECRET and BETTER_AUTH_URL before starting FLIPLOG",
    );
  const url = new URL(baseURL);
  if (
    url.protocol !== "https:" &&
    !["127.0.0.1", "localhost"].includes(url.hostname)
  )
    throw new Error("Non-local authentication requires HTTPS");
  return {
    appName: "FLIPLOG",
    database,
    secret,
    baseURL,
    trustedOrigins: [url.origin],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      maxPasswordLength: 128,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 20 },
        "/sign-up/email": { window: 60, max: 10 },
      },
    },
    advanced: {
      cookiePrefix: url.port ? `fliplog-${url.port}` : "fliplog",
      useSecureCookies: url.protocol === "https:",
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
    },
  };
}
