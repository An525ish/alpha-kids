"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CheckInReminder } from "../types";

type Args = {
  reminder: CheckInReminder | null;
  onDue: () => void;
};

function emptySubscribe() {
  return () => {};
}

function subscribeSeconds(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

export function useCheckInTicker({ reminder, onDue }: Args) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const ticking = Boolean(isClient && reminder && reminder.status === "pending");
  const now = useSyncExternalStore(
    ticking ? subscribeSeconds : emptySubscribe,
    () => Date.now(),
    () => 0,
  );

  useEffect(() => {
    if (!isClient || !reminder || reminder.status !== "pending") return;
    if (now >= reminder.dueAt) onDue();
  }, [isClient, reminder, onDue, now]);

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
    remainingMs: Math.max(0, reminder.dueAt - now),
    isDue: reminder.status === "due" || now >= reminder.dueAt,
    ready: true,
  };
}
