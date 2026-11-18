"use client";

import { useId, type FormEvent, type KeyboardEvent } from "react";
import { StarterChips } from "./StarterChips";

type Props = {
  value: string;
  disabled: boolean;
  showStarters: boolean;
  onChange: (value: string) => void;
  onSubmit: (message: string) => void | Promise<void>;
};

export function ConcernComposer({
  value,
  disabled,
  showStarters,
  onChange,
  onSubmit,
}: Props) {
  const fieldId = useId();

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
    <form className="ak-sticky" onSubmit={handleSubmit}>
      <span className="ak-sticky__pin" aria-hidden="true" />
      <label className="ak-sticky__label" htmlFor={fieldId}>
        Pin a concern
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
        placeholder="English or Urdu. What is hard right now?"
        maxLength={2000}
      />
      {showStarters ? (
        <StarterChips disabled={disabled} onPick={(fill) => onChange(fill)} />
      ) : null}
      <div className="ak-sticky__row">
        <p className="ak-trust">Not a doctor. Not for emergencies.</p>
        <button
          className="ak-btn ak-btn--primary"
          type="submit"
          disabled={disabled || value.trim().length === 0}
        >
          Stick a plan
        </button>
      </div>
    </form>
  );
}
