"use client";

import { useCallback, useRef, useState } from "react";
import type { LocaleCode } from "../../i18n";
import { useCoach } from "../../hooks/useCoach";
import { useLocale } from "../../hooks/useLocale";
import { CheckInBanner } from "../check-in/CheckInBanner";
import { MessageThread } from "../board/MessageThread";
import { ConcernComposer } from "../composer/ConcernComposer";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { LanguageToggle } from "../ui/LanguageToggle";
import { IntroArt } from "./IntroArt";
import { WallShapes } from "./WallShapes";
import "@/styles/coach-desk.css";

export function CoachDesk() {
  const {
    messages,
    isSending,
    error,
    reminder,
    sendConcern,
    relocalizeThread,
    markReminderDue,
    dismissReminder,
    clear,
  } = useCoach();
  const { language, messages: t } = useLocale();
  const [draft, setDraft] = useState("");
  const [dockExpanded, setDockExpanded] = useState(true);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const fieldFocusRef = useRef<HTMLDivElement>(null);
  const hasThread = messages.length > 0;
  const canClear = hasThread || !!reminder || draft.trim().length > 0;

  const expandDock = useCallback(() => {
    setDockExpanded(true);
  }, []);

  const collapseDock = useCallback(() => {
    setDockExpanded(false);
  }, []);

  const focusComposer = useCallback(() => {
    setDockExpanded(true);
    requestAnimationFrame(() => {
      const field = fieldFocusRef.current?.querySelector("textarea");
      field?.focus();
    });
  }, []);

  const handleDraftChange = useCallback((next: string) => {
    setDraft(next);
    if (next.trim().length > 0) {
      setDockExpanded(true);
    }
  }, []);

  function handleLanguageChange(next: LocaleCode) {
    if (next === language) return;
    setDraft("");
    void relocalizeThread(next);
  }

  return (
    <main className="ak-wall" lang={language}>
      <WallShapes />

      <div className="ak-wall__grid">
        <header className="ak-intro">
          <p className="ak-kicker">{t.kicker}</p>
          <div className="ak-title-row">
            <h1 className="ak-brand" lang={language}>
              {t.brand}
            </h1>
            <LanguageToggle
              variant="compact"
              value={language}
              ariaLabel={t.languageToggleAria}
              onChange={handleLanguageChange}
            />
          </div>
          <p className="ak-lede ak-lede--full">{t.ledeFull}</p>
          <p className="ak-lede ak-lede--short">{t.ledeShort}</p>
          <div className="ak-lang-picker">
            <p className="ak-lang-picker__label">{t.languageToggleLabel}</p>
            <LanguageToggle
              variant="desktop"
              value={language}
              ariaLabel={t.languageToggleAria}
              onChange={handleLanguageChange}
            />
          </div>
          <IntroArt />
        </header>

        <section className="ak-board" aria-label={t.boardAria}>
          <div className="ak-board__bar">
            <p className="ak-board__bar-label">{t.boardLabel}</p>
            <button
              className="ak-btn ak-btn--ghost ak-board__clear"
              type="button"
              disabled={!canClear}
              onClick={() => setClearConfirmOpen(true)}
            >
              {t.boardClear}
            </button>
          </div>

          {reminder ? (
            <CheckInBanner
              reminder={reminder}
              onDue={markReminderDue}
              onDismiss={dismissReminder}
              onReply={() => {
                dismissReminder();
                focusComposer();
              }}
            />
          ) : null}

          <div className="ak-board__scroll">
            {error ? (
              <p className="ak-status ak-status--error" role="alert">
                {error}
              </p>
            ) : null}

            {!hasThread && !isSending ? (
              <div className="ak-empty">
                <p className="ak-empty__title">{t.emptyTitle}</p>
                <p className="ak-empty__body">{t.emptyBody}</p>
              </div>
            ) : null}

            <MessageThread messages={messages} isSending={isSending} />
          </div>

          <div
            className={`ak-board__dock${dockExpanded ? "" : " ak-board__dock--peek"}`}
            ref={fieldFocusRef}
          >
            {!dockExpanded ? (
              <button
                type="button"
                className="ak-dock-peek"
                aria-label={t.peekAria}
                onClick={() => {
                  expandDock();
                  requestAnimationFrame(() => {
                    fieldFocusRef.current?.querySelector("textarea")?.focus();
                  });
                }}
              >
                <span className="ak-dock-peek__pin" aria-hidden="true">
                  <span className="ak-sticky__pin-arrows ak-sticky__pin-arrows--up">
                    <span />
                    <span />
                  </span>
                </span>
                {hasThread ? t.peekThread : t.peekEmpty}
              </button>
            ) : (
              <ConcernComposer
                value={draft}
                disabled={isSending}
                showStarters={!hasThread}
                onChange={handleDraftChange}
                onSubmit={sendConcern}
                onCollapse={collapseDock}
              />
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={clearConfirmOpen}
        language={language}
        title={t.clearConfirmTitle}
        body={t.clearConfirmBody}
        cancelLabel={t.clearConfirmKeep}
        confirmLabel={t.clearConfirmClear}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={() => {
          setClearConfirmOpen(false);
          clear();
          setDraft("");
          dismissReminder();
          setDockExpanded(true);
        }}
      />
    </main>
  );
}
