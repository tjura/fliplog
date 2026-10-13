"use client";

import { useSyncExternalStore } from "react";

const subscribeToClient = () => () => {};

// Keep server-rendered controls disabled until their client handlers are ready.
export function useClientReady() {
  return useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
}
