"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "./client";
import { useClientReady } from "../../components/use-client-ready";

export function SignOut() {
  const router = useRouter();
  const ready = useClientReady();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  async function signOut() {
    setPending(true);
    setFailed(false);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        setFailed(true);
        setPending(false);
      } else {
        // Stay pending until the refreshed header replaces this control.
        router.replace("/");
        router.refresh();
      }
    } catch {
      setFailed(true);
      setPending(false);
    }
  }
  return (
    <div>
      <button
        className="text-button"
        onClick={signOut}
        disabled={pending || !ready}
      >
        {pending ? "Signing out…" : failed ? "Retry sign out" : "Sign out"}
      </button>
      {failed ? (
        <span role="alert" className="form-error">
          Couldn’t sign out.
        </span>
      ) : null}
    </div>
  );
}
