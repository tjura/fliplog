"use client";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main id="main" tabIndex={-1}>
      <h1>We couldn’t load this page</h1>
      <p>Your saved ratings have not been changed. Try again.</p>
      <button onClick={retry}>Retry</button>
    </main>
  );
}
