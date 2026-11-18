"use client";

import { useEffect, useRef } from "react";
import type { ConversationMessage } from "../types";
import { CoachPlanCard } from "./CoachPlanCard";
import { EscalateCard } from "./EscalateCard";

type Props = {
  messages: ConversationMessage[];
  isSending: boolean;
};

export function MessageThread({ messages, isSending }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  if (messages.length === 0 && !isSending) return null;

  return (
    <div className="ak-thread" aria-live="polite">
      {messages.map((message) => {
        if (message.role === "parent") {
          return (
            <article key={message.id} className="ak-note">
              <span className="ak-note__tag">You wrote</span>
              <p className="ak-note__body">{message.content}</p>
            </article>
          );
        }

        if (message.reply.mode === "escalate") {
          return <EscalateCard key={message.id} reply={message.reply} />;
        }

        return <CoachPlanCard key={message.id} reply={message.reply} />;
      })}

      {isSending ? (
        <p className="ak-status ak-waiting" aria-label="Making a plan">
          <span className="ak-waiting__dot" />
          <span className="ak-waiting__dot" />
          <span className="ak-waiting__dot" />
          Making a short plan
        </p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
