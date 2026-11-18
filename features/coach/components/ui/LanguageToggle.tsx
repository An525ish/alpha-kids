"use client";

import { Fragment } from "react";
import { LOCALES, type LocaleCode } from "../../i18n";

type Props = {
  value: LocaleCode;
  variant: "compact" | "desktop";
  ariaLabel: string;
  onChange: (language: LocaleCode) => void;
};

export function LanguageToggle({ value, variant, ariaLabel, onChange }: Props) {
  const compact = variant === "compact";

  return (
    <ul className={`ak-langs ak-langs--${variant}`} aria-label={ariaLabel}>
      {LOCALES.map((locale, index) => (
        <Fragment key={locale.code}>
          {compact && index > 0 ? (
            <li className="ak-langs__rule" aria-hidden="true" />
          ) : null}
          <li>
            <button
              type="button"
              className={`ak-lang ak-lang--${locale.code}${
                value === locale.code ? " ak-lang--active" : ""
              }`}
              lang={locale.code}
              aria-pressed={value === locale.code}
              onClick={() => onChange(locale.code)}
            >
              {compact ? locale.shortLabel : locale.label}
            </button>
          </li>
        </Fragment>
      ))}
    </ul>
  );
}
