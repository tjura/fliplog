"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClientReady } from "../../components/use-client-ready";
import {
  isSavedRating,
  ratingLabels,
  ratingOptions,
  ratingText,
  type Rating,
  type SavedRating,
} from "./rules.ts";

export function RatingForm({
  skillId,
  initialSaved,
  returnTo,
}: {
  skillId: string;
  initialSaved: SavedRating;
  returnTo: string;
}) {
  const router = useRouter();
  const ready = useClientReady();
  const [saved, setSaved] = useState(initialSaved);
  const [draft, setDraft] = useState(initialSaved.rating);
  const [pending, setPending] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [retryValue, setRetryValue] = useState<Rating | null | undefined>(
    undefined,
  );
  const [message, setMessage] = useState("");

  async function commit(rating: Rating | null) {
    if (pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, rating }),
      });
      if (response.status === 401) {
        setExpired(true);
        setError(
          "Your session ended. Sign in again to save. Your choice has not been saved.",
        );
        return;
      }
      if (!response.ok) throw new Error("Rating was not committed");
      const result: unknown = await response.json();
      if (!isSavedRating(result)) throw new Error("Invalid save response");
      setSaved(result);
      setDraft(result.rating);
      setExpired(false);
      setConfirmReset(false);
      setRetryValue(undefined);
      setMessage(rating === null ? "Rating cleared. Not started." : "Saved");
      router.refresh();
    } catch {
      setRetryValue(rating);
      setError(
        "We couldn’t confirm the save. Your last confirmed rating is shown. Check your connection and retry.",
      );
    } finally {
      setPending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft !== null) void commit(draft);
  }

  return (
    <div className="rating-form">
      <p className="saved-rating">Saved: {ratingText(saved.rating)}</p>
      {saved.updatedAt ? (
        <p className="note">
          Updated{" "}
          <time dateTime={saved.updatedAt}>{saved.updatedAt.slice(0, 10)}</time>{" "}
          (UTC)
        </p>
      ) : null}
      <form method="post" onSubmit={submit} aria-busy={pending || !ready}>
        <fieldset
          disabled={pending || !ready}
          aria-describedby="rating-choice rating-error"
        >
          <legend>Choose your self-rating</legend>
          <div className="rating-choices">
            {ratingOptions.map((rating) => (
              <label className="rating-option" key={rating}>
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={draft === rating}
                  aria-label={`${rating} ${rating === 1 ? "star" : "stars"} — ${ratingLabels[rating]}`}
                  onChange={() => {
                    setDraft(rating);
                    setError("");
                    setMessage("");
                    setRetryValue(undefined);
                  }}
                />
                <span aria-hidden="true">
                  {rating}
                  <svg viewBox="0 0 24 24">
                    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
                  </svg>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <p id="rating-choice">
          {draft === null
            ? "No rating selected."
            : `${draft !== saved.rating ? "Unsaved choice: " : "Selected: "}${ratingText(draft)}`}
        </p>
        <button
          type="submit"
          disabled={
            !ready || pending || draft === null || draft === saved.rating
          }
        >
          {pending ? "Saving…" : "Save rating"}
        </button>
      </form>
      <p className="save-status" role="status">
        {message}
      </p>
      <div
        id="rating-error"
        role="alert"
        className={error ? "form-error" : undefined}
      >
        {error}
      </div>
      {expired ? (
        <>
          <Link
            className="button secondary"
            href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`}
          >
            Sign in again
          </Link>
          <p className="note">
            After signing in, reselect your unsaved choice. It is kept only
            while this page stays open.
          </p>
        </>
      ) : error && retryValue !== undefined ? (
        <button
          className="secondary"
          disabled={pending || !ready}
          onClick={() => void commit(retryValue)}
        >
          Retry save
        </button>
      ) : null}
      {saved.rating !== null ? (
        confirmReset ? (
          <div className="reset-confirm">
            <p>
              Clear this skill’s current rating? This leaves your other skills
              unchanged.
            </p>
            <div className="button-row">
              <button
                className="secondary"
                disabled={pending || !ready}
                onClick={() => {
                  setConfirmReset(false);
                  // A cancelled reset must not leave a retry that clears the rating.
                  if (retryValue === null) {
                    setError("");
                    setRetryValue(undefined);
                  }
                }}
              >
                Cancel
              </button>
              <button
                disabled={pending || !ready}
                onClick={() => void commit(null)}
              >
                Clear rating
              </button>
            </div>
          </div>
        ) : (
          <button
            className="text-button"
            onClick={() => setConfirmReset(true)}
            disabled={pending || !ready}
          >
            Mark as not started
          </button>
        )
      ) : null}
      <p className="note">
        A personal rating for this surface, not a safety clearance. Record your
        actual coached practice.
      </p>
      <noscript>
        <p className="note">Enable JavaScript to edit progress or sign out.</p>
      </noscript>
    </div>
  );
}
