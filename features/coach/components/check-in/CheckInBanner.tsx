"use client";

import { useCallback, useState } from "react";
import { getMessages, isRtlLocale } from "../../i18n";
import { useCheckInTicker } from "../../hooks/useCheckInTicker";
import type { CheckInReminder } from "../../types";
import { formatRemaining } from "../../utils/checkIn";
import { ConfirmDialog } from "../ui/ConfirmDialog";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const t = getMessages(reminder.language);
  const rtl = isRtlLocale(reminder.language);

  const stableOnDue = useCallback(() => {
    onDue();
  }, [onDue]);

  const { remainingMs, isDue, ready } = useCheckInTicker({
    reminder,
    onDue: stableOnDue,
  });

  const totalMs = reminder.dueInMinutes * 60_000;
  const progress =
    !ready || totalMs <= 0 ? 1 : Math.min(1, Math.max(0, remainingMs / totalMs));

  return (
    <>
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
            {isDue ? t.timerNow : ready ? formatRemaining(remainingMs) : "…"}
          </div>
        </div>

        <div className="ak-timer__body">
          <span className="ak-timer__label">
            {isDue ? t.timerDue : t.timerLabel}
          </span>
          <p className="ak-timer__text">{reminder.text}</p>
          {isDue ? (
            <div className="ak-timer__actions">
              <button className="ak-btn ak-btn--primary" type="button" onClick={onReply}>
                {t.timerWriteUpdate}
              </button>
            </div>
          ) : null}
        </div>

        <button
          className="ak-timer__close"
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={t.timerDismissAria}
        >
          <span aria-hidden="true">×</span>
        </button>
      </aside>

      <ConfirmDialog
        open={confirmOpen}
        language={reminder.language}
        title={t.confirmTitle}
        body={t.confirmBody}
        cancelLabel={t.confirmKeep}
        confirmLabel={t.confirmDismiss}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDismiss();
        }}
      />
    </>
  );
}
