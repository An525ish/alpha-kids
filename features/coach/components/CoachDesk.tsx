"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCoach } from "../hooks/useCoach";
import { CheckInBanner } from "./CheckInBanner";
import { ConcernComposer } from "./ConcernComposer";
import { IntroArt } from "./IntroArt";
import { MessageThread } from "./MessageThread";
import { WallShapes } from "./WallShapes";
import "./coach-desk.css";

export function CoachDesk() {
  const {
    messages,
    isSending,
    error,
    reminder,
    sendConcern,
    markReminderDue,
    dismissReminder,
    clear,
  } = useCoach();
  const [draft, setDraft] = useState("");
  const [dockExpanded, setDockExpanded] = useState(true);
  const fieldFocusRef = useRef<HTMLDivElement>(null);
  const hasThread = messages.length > 0;

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

  useEffect(() => {
    if (draft.trim().length > 0) {
      setDockExpanded(true);
    }
  }, [draft]);

  return (
    <main className="ak-wall">
      <WallShapes />

      <div className="ak-wall__grid">
        <header className="ak-intro">
          <p className="ak-kicker">Family wall coach</p>
          <div className="ak-title-row">
            <h1 className="ak-brand">Alpha Kids</h1>
            <ul
              className="ak-langs ak-langs--compact"
              aria-label="Supported languages"
            >
              <li>
                <span className="ak-lang ak-lang--en">EN</span>
              </li>
              <li className="ak-langs__rule" aria-hidden="true" />
              <li>
                <span className="ak-lang ak-lang--ur" lang="ur">
                  اردو
                </span>
              </li>
            </ul>
          </div>
          <p className="ak-lede ak-lede--full">
            Pin what is hard. Stick a short plan. Come back when the timer dings.
          </p>
          <p className="ak-lede ak-lede--short">
            Pin what is hard. Stick a short plan.
          </p>
          <ul className="ak-langs ak-langs--desktop" aria-label="Supported languages">
            <li>
              <span className="ak-lang ak-lang--en">English</span>
            </li>
            <li>
              <span className="ak-lang ak-lang--ur" lang="ur">
                اردو
              </span>
            </li>
          </ul>
          <IntroArt />
        </header>

        <section className="ak-board" aria-label="Coaching board">
          <div className="ak-board__bar">
            <p className="ak-board__bar-label">Your board</p>
            <button
              className="ak-btn ak-btn--ghost ak-board__clear"
              type="button"
              disabled={!hasThread && !reminder && draft.trim().length === 0}
              onClick={() => {
                clear();
                setDraft("");
                dismissReminder();
                setDockExpanded(true);
              }}
            >
              Clear the board
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
                <p className="ak-empty__title">Empty board. Start with one hard moment.</p>
                <p className="ak-empty__body">
                  Bedtime, tantrums, school rush, sibling fights. Tap a magnet below or write your own.
                </p>
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
                aria-label={hasThread ? "Expand composer" : "Pin a concern"}
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
                {hasThread ? "Pin another concern" : "Pin a concern"}
              </button>
            ) : (
              <ConcernComposer
                value={draft}
                disabled={isSending}
                showStarters={!hasThread}
                onChange={setDraft}
                onSubmit={sendConcern}
                onCollapse={collapseDock}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
