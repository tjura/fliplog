import "server-only";
import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { cache } from "react";
import { authOptions } from "./auth-config.ts";
import { getDatabase } from "./database";

let auth: ReturnType<typeof betterAuth> | undefined;
export function getAuth() {
  auth ??= betterAuth(authOptions(getDatabase()));
  return auth;
}

// Per-render deduplication only; never put a user's session in a shared cache.
export const getSession = cache(async () => {
  const requestHeaders = await headers();
  return getAuth().api.getSession({ headers: requestHeaders });
});
