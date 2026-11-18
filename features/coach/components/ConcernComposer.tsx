"use client";

import { useId, type FormEvent, type KeyboardEvent } from "react";
import { useLocale } from "../hooks/useLocale";
import { StarterChips } from "./StarterChips";

type Props = {
  value: string;
  disabled: boolean;
  showStarters: boolean;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void | Promise<void>;
  onCollapse: () => void;
};

export function ConcernComposer({
  value,
  disabled,
  showStarters,
  onChange,
  onSubmit,
  onCollapse,
}: Props) {
  const fieldId = useId();
  const { language, messages: t, isRtl, dir } = useLocale();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = value.trim();
    if (!next || disabled) return;
    onChange("");
    await onSubmit(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form
      className={`ak-sticky${isRtl ? " ak-rtl" : ""}`}
      lang={language}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="ak-sticky__pin"
        onClick={onCollapse}
        aria-label={t.composerCollapse}
        title={t.composerCollapse}
      >
        <span className="ak-sticky__pin-arrows" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
      <label className="ak-sticky__label" htmlFor={fieldId}>
        {t.composerLabel}
      </label>
      <textarea
        id={fieldId}
        className="ak-sticky__field"
        name="concern"
        rows={4}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.composerPlaceholder}
        maxLength={2000}
        dir={dir}
      />
      {showStarters ? (
        <StarterChips disabled={disabled} onPick={(fill) => onChange(fill)} />
      ) : null}
      <div className="ak-sticky__row">
        <button
          className="ak-btn ak-btn--primary"
          type="submit"
          disabled={disabled || value.trim().length === 0}
        >
          {t.composerSubmit}
        </button>
        <p className="ak-trust">{t.composerTrust}</p>
      </div>
    </form>
  );
}
