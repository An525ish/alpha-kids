"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CheckInReminder } from "../types";

type Args = {
  reminder: CheckInReminder | null;
  onDue: () => void;
};

function subscribeNoop() {
  return () => {};
}


function useIsClient() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

let nowSnapshot = 0;

function subscribeNow(onStoreChange: () => void) {
  nowSnapshot = Date.now();
  const id = window.setInterval(() => {
    nowSnapshot = Date.now();
    onStoreChange();
  }, 1000);
  return () => window.clearInterval(id);
}

function getNowSnapshot() {
  return nowSnapshot;
}

function getServerNowSnapshot() {
  return 0;
}

/** Live clock while enabled; hydration-safe via useSyncExternalStore. */
function useNow(enabled: boolean) {
  return useSyncExternalStore(
    enabled ? subscribeNow : subscribeNoop,
    getNowSnapshot,
    getServerNowSnapshot,
  );
}

export function useCheckInTicker({ reminder, onDue }: Args) {
  const isClient = useIsClient();
  const pending = reminder?.status === "pending";
  const now = useNow(isClient && pending);

  useEffect(() => {
    if (!pending || !reminder) return;
    if (now >= reminder.dueAt) onDue();
  }, [pending, reminder, now, onDue]);

  if (!reminder) {
    return { remainingMs: 0, isDue: false, ready: true };
  }

  if (!isClient) {
    return {
      remainingMs: 0,
      isDue: reminder.status === "due",
      ready: false,
    };
  }

  return {
    remainingMs: pending ? Math.max(0, reminder.dueAt - now) : 0,
    isDue: reminder.status === "due" || (pending && now >= reminder.dueAt),
    ready: true,
  };
}
