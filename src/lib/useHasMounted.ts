"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only once the component has mounted in the browser. Used to defer
 * rendering client-only state (like the persisted cart) until after
 * hydration, without the render-then-setState pattern that triggers a
 * `react-hooks/set-state-in-effect` lint error.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
