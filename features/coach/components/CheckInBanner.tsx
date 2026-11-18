"use client";

import { useCallback } from "react";
import { useCheckInTicker } from "../hooks/useCheckInTicker";
import type { CheckInReminder } from "../types";
import { formatRemaining } from "../utils/checkIn";

type Props = {
  reminder: CheckInReminder;
  onDue: () => void;
  onDismiss: () => void;
  onReply: () => void;
};

export function CheckInBanner({
  reminder,
  onDue,
  onDismiss,
  onReply,
}: Props) {
  const stableOnDue = useCallback(() => {
    onDue();
  }, [onDue]);

  const { remainingMs, isDue, ready } = useCheckInTicker({
    reminder,
    onDue: stableOnDue,
  });

  const rtl = reminder.language === "ur";
  const totalMs = reminder.dueInMinutes * 60_000;
  const progress =
    !ready || totalMs <= 0 ? 1 : Math.min(1, Math.max(0, remainingMs / totalMs));

  return (
    <aside
      className={`ak-timer${isDue ? " ak-timer--due" : ""}${rtl ? " ak-rtl" : ""}`}
      lang={reminder.language}
      role="status"
      aria-live="polite"
    >
      <div
        className="ak-timer__dial"
        style={{ ["--progress" as string]: progress }}
        aria-hidden="true"
      >
        <div className="ak-timer__dial-core">
          {isDue ? (rtl ? "اب" : "NOW") : ready ? formatRemaining(remainingMs) : "…"}
        </div>
      </div>

      <div>
        <span className="ak-timer__label">
          {isDue
            ? rtl
              ? "واپسی کا وقت"
              : "Timer's up"
            : rtl
              ? "کچن ٹائمر"
              : "Kitchen timer"}
        </span>
        <p className="ak-timer__text">{reminder.text}</p>
        <div className="ak-timer__actions">
          {isDue ? (
            <button className="ak-btn ak-btn--primary" type="button" onClick={onReply}>
              {rtl ? "جواب لکھیں" : "Write an update"}
            </button>
          ) : null}
          <button className="ak-btn ak-btn--ghost" type="button" onClick={onDismiss}>
            {rtl ? "چھوڑیں" : "Dismiss"}
          </button>
        </div>
      </div>
    </aside>
  );
}
