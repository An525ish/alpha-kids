"use client";

import { useEffect, useId, useRef } from "react";
import { isRtlLocale, type LocaleCode } from "../../i18n";

type Props = {
  open: boolean;
  language: LocaleCode;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  language,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rtl = isRtlLocale(language);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`ak-confirm${rtl ? " ak-rtl" : ""}`}
      lang={language}
      aria-modal="true"
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div
        className="ak-confirm__card"
        role="document"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="ak-confirm__title">
          {title}
        </h2>
        <p className="ak-confirm__body">{body}</p>
        <div className="ak-confirm__actions">
          <button
            className="ak-btn ak-btn--ghost"
            type="button"
            onClick={onClose}
            autoFocus
          >
            {cancelLabel}
          </button>
          <button className="ak-btn ak-btn--primary" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
