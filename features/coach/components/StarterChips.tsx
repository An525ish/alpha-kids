"use client";

import { useLocale } from "../hooks/useLocale";

type Props = {
  disabled: boolean;
  onPick: (fill: string) => void;
};

export function StarterChips({ disabled, onPick }: Props) {
  const { language, messages: t } = useLocale();

  return (
    <div
      className="ak-starters"
      role="group"
      aria-label={t.startersAria}
      lang={language}
    >
      {t.starters.map((starter) => (
        <button
          key={starter.id}
          type="button"
          className="ak-chip"
          disabled={disabled}
          onClick={() => onPick(starter.fill)}
        >
          {starter.label}
        </button>
      ))}
    </div>
  );
}
