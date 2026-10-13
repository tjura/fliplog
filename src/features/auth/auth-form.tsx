"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "./client";
import { authErrorMessage } from "./error-message";
import { useClientReady } from "../../components/use-client-ready";

export function AuthForm({
  createAccount,
  returnTo,
}: {
  createAccount: boolean;
  returnTo: string;
}) {
  const router = useRouter();
  const ready = useClientReady();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setPending(true);
    setError("");
    try {
      const result = createAccount
        ? await authClient.signUp.email({ email, password, name: "Learner" })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(authErrorMessage(result.error.status, createAccount));
        setPending(false);
      } else {
        // Stay pending until navigation replaces the form. Refresh invalidates
        // cached server output after the session cookie changes.
        router.replace(returnTo);
        router.refresh();
      }
    } catch {
      setError("We couldn’t connect. Check your connection and retry.");
      setPending(false);
    }
  }
  return (
    <>
      <h1>{createAccount ? "Start your journal" : "Welcome back"}</h1>
      <p>
        {createAccount
          ? "Record your own progress, one skill at a time."
          : "Sign in to your practice journal."}
      </p>
      <form
        className="auth-form"
        method="post"
        onSubmit={submit}
        aria-busy={pending || !ready}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          aria-describedby={error ? "auth-error" : undefined}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={createAccount ? "new-password" : "current-password"}
          required
          minLength={createAccount ? 10 : undefined}
          maxLength={128}
          aria-describedby={
            createAccount ? "password-help auth-error" : "auth-error"
          }
        />
        {createAccount ? (
          <p id="password-help" className="note">
            Use 10–128 characters. Choose a password you don’t use elsewhere.
          </p>
        ) : null}
        <p id="auth-error" role="alert" className="form-error">
          {error}
        </p>
        <button type="submit" disabled={pending || !ready}>
          {!ready
            ? "Preparing form…"
            : pending
              ? "Please wait…"
              : error
                ? "Retry"
                : createAccount
                  ? "Create account"
                  : "Sign in"}
        </button>
      </form>
      <noscript>
        <p>Enable JavaScript to sign in or create an account.</p>
      </noscript>
      <Link
        className="button secondary auth-switch"
        href={`/${createAccount ? "sign-in" : "sign-up"}?returnTo=${encodeURIComponent(returnTo)}`}
      >
        {createAccount ? "I already have an account" : "Create account"}
      </Link>
      <p className="note auth-limit">
        Demo accounts have no email verification or password recovery. For adult
        learners; keep sensitive information out of this demo.
      </p>
    </>
  );
}
