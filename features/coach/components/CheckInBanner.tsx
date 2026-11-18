"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (confirmOpen) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [confirmOpen]);

  function closeConfirm() {
    setConfirmOpen(false);
  }

  function confirmDismiss() {
    setConfirmOpen(false);
    onDismiss();
  }

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
            {isDue ? (rtl ? "اب" : "NOW") : ready ? formatRemaining(remainingMs) : "…"}
          </div>
        </div>

        <div className="ak-timer__body">
          <span className="ak-timer__label">
            {isDue
              ? rtl
                ? "واپسی کا وقت"
                : "Time's up"
              : rtl
                ? "کچن ٹائمر"
                : "Kitchen timer"}
          </span>
          <p className="ak-timer__text">{reminder.text}</p>
          {isDue ? (
            <div className="ak-timer__actions">
              <button className="ak-btn ak-btn--primary" type="button" onClick={onReply}>
                {rtl ? "جواب لکھیں" : "Write an update"}
              </button>
            </div>
          ) : null}
        </div>

        <button
          className="ak-timer__close"
          type="button"
          onClick={() => setConfirmOpen(true)}
          aria-label={rtl ? "چھوڑیں" : "Dismiss"}
        >
          <span aria-hidden="true">×</span>
        </button>
      </aside>

      <dialog
        ref={dialogRef}
        className={`ak-confirm${rtl ? " ak-rtl" : ""}`}
        lang={reminder.language}
        aria-modal="true"
        aria-labelledby={titleId}
        onClose={closeConfirm}
        onCancel={(event) => {
          event.preventDefault();
          closeConfirm();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeConfirm();
        }}
      >
        <div
          className="ak-confirm__card"
          role="document"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 id={titleId} className="ak-confirm__title">
            {rtl ? "یہ ٹائمر ہٹا دیں؟" : "Dismiss this timer?"}
          </h2>
          <p className="ak-confirm__body">
            {rtl
              ? "اگر ہٹائیں گے تو چیک اِن یاددہانی ختم ہو جائے گی۔"
              : "If you dismiss it, this check-in reminder goes away."}
          </p>
          <div className="ak-confirm__actions">
            <button
              className="ak-btn ak-btn--ghost"
              type="button"
              onClick={closeConfirm}
              autoFocus
            >
              {rtl ? "رکھیں" : "Keep it"}
            </button>
            <button className="ak-btn ak-btn--primary" type="button" onClick={confirmDismiss}>
              {rtl ? "ہٹائیں" : "Dismiss"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
