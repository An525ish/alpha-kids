"use client";

import { useId, type FormEvent, type KeyboardEvent } from "react";
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
      <button
        type="button"
        className="ak-sticky__pin"
        onClick={onCollapse}
        aria-label="Collapse composer"
        title="Collapse"
      >
        <span className="ak-sticky__pin-arrows" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
      <label className="ak-sticky__label" htmlFor={fieldId}>
        What's going on
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
        placeholder="English or Urdu. Just type what's hard right now."
        maxLength={2000}
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
          Stick a plan
        </button>
        <p className="ak-trust">Not a doctor. Not for emergencies.</p>
      </div>
    </form>
  );
}
