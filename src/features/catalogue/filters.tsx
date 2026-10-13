"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cataloguePath, groups } from "./catalogue";
import { useClientReady } from "../../components/use-client-ready";

export function Filters({
  surface,
  group,
  view = "all",
}: {
  surface: string;
  group: string;
  view?: string;
}) {
  const router = useRouter();
  const ready = useClientReady();
  const [pending, startTransition] = useTransition();
  // Keep the chosen value visible while the filtered catalogue loads.
  const [selected, setSelected] = useOptimistic({ surface, group });
  function select(next: { surface: string; group: string }) {
    startTransition(() => {
      setSelected(next);
      router.push(cataloguePath(next.surface, next.group, view), {
        scroll: false,
      });
    });
  }
  return (
    <div>
      <div className="filters" aria-busy={pending || !ready}>
        <label>
          Surface
          <select
            disabled={pending || !ready}
            value={selected.surface}
            onChange={(event) =>
              select({ ...selected, surface: event.target.value })
            }
          >
            <option value="all">All surfaces</option>
            <option value="trampoline">Trampoline</option>
            <option value="air-track">Air track</option>
          </select>
        </label>
        <label>
          Group
          <select
            disabled={pending || !ready}
            value={selected.group}
            onChange={(event) =>
              select({ ...selected, group: event.target.value })
            }
          >
            <option value="all">All groups</option>
            {groups.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="filter-status" role="status">
        {!ready ? "Preparing filters…" : pending ? "Updating skills…" : ""}
      </p>
      <noscript>
        <p className="note">
          Enable JavaScript to filter. You can still browse the groups and open
          skills below.
        </p>
      </noscript>
    </div>
  );
}
