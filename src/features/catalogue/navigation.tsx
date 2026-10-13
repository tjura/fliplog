"use client";

import Link from "next/link";
import { useLayoutEffect } from "react";
import type { ReactNode } from "react";

const positionKey = "fliplog:catalogue-position";
const restoreKey = "fliplog:restore-catalogue";

export function SkillLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="skill-row"
      href={href}
      onClick={() => {
        try {
          sessionStorage.setItem(
            positionKey,
            JSON.stringify({
              path: window.location.pathname + window.location.search,
              top: window.scrollY,
            }),
          );
        } catch {
          /* Navigation still works when browser storage is unavailable. */
        }
      }}
    >
      {children}
    </Link>
  );
}

export function BackToSkills({ href }: { href: string }) {
  return (
    <Link
      className="back-link"
      href={href}
      scroll={false}
      onClick={() => {
        try {
          sessionStorage.setItem(restoreKey, href);
        } catch {
          /* Use the canonical catalogue link as the fallback. */
        }
      }}
    >
      <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to skills
    </Link>
  );
}

// Auth adds a route between list and detail, so native history alone cannot
// restore that list. Store only public UI position, never a private rating draft.
export function CataloguePosition({ path }: { path: string }) {
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(restoreKey) !== path) return;
      sessionStorage.removeItem(restoreKey);
      const position: unknown = JSON.parse(
        sessionStorage.getItem(positionKey) ?? "null",
      );
      if (
        typeof position === "object" &&
        position !== null &&
        "path" in position &&
        "top" in position &&
        position.path === path &&
        typeof position.top === "number" &&
        Number.isFinite(position.top)
      )
        window.scrollTo(0, Math.max(0, position.top));
      else window.scrollTo(0, 0);
    } catch {
      /* Default navigation remains available without browser storage. */
    }
  }, [path]);
  return null;
}
