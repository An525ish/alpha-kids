"use client";

import { useShallow } from "zustand/react/shallow";
import { postCoachMessage } from "../api/coach";
import { getMessages, type LocaleCode } from "../i18n";
import { useConversationStore } from "../stores/conversation";
import { reminderFromReply } from "../utils/checkIn";
import { createId, toApiHistory } from "../utils/history";
import { localizeStarterContent } from "../utils/localizeContent";
import type { ConversationMessage } from "../types";

export function useCoach() {
  const { messages, isSending, error, reminder, markReminderDue, dismissReminder, clear } =
    useConversationStore(
      useShallow((s) => ({
        messages: s.messages,
        isSending: s.isSending,
        error: s.error,
        reminder: s.reminder,
        markReminderDue: s.markReminderDue,
        dismissReminder: s.dismissReminder,
        clear: s.clear,
      })),
    );

  async function sendConcern(raw: string) {
    const message = raw.trim();
    const {
      isSending: sending,
      messages: currentMessages,
      language: replyLanguage,
      addParentMessage,
      addCoachMessage,
      setSending,
      setError,
    } = useConversationStore.getState();

    if (!message || sending) return;

    const history = toApiHistory(currentMessages);
    addParentMessage(message);
    setSending(true);
    setError(null);

    try {
      const reply = await postCoachMessage({
        message,
        history,
        language: replyLanguage,
      });
      addCoachMessage(reply);
    } catch (err) {
      const fallback = getMessages(replyLanguage).reachError;
      const text = err instanceof Error ? err.message : fallback;
      setError(text);
    } finally {
      setSending(false);
    }
  }

  /** Rebuild the board thread in the chosen locale (starters + coach replies). */
  async function relocalizeThread(language: LocaleCode) {
    const {
      messages: current,
      isSending: sending,
      setLanguage,
      setSending,
      setError,
      replaceThread,
      dismissReminder,
    } = useConversationStore.getState();

    setLanguage(language);

    const parentTurns = current.filter((message) => message.role === "parent");
    if (parentTurns.length === 0 || sending) return;

    setSending(true);
    setError(null);
    dismissReminder();

    try {
      const next: ConversationMessage[] = [];
      let reminder = null as ReturnType<typeof reminderFromReply>;

      for (const parent of parentTurns) {
        const content = localizeStarterContent(parent.content, language);
        next.push({
          ...parent,
          content,
        });

        const reply = await postCoachMessage({
          message: content,
          history: toApiHistory(next.slice(0, -1)),
          language,
          instant: true,
        });

        next.push({
          id: createId(),
          role: "coach",
          reply,
          createdAt: Date.now(),
        });

        const fromReply = reminderFromReply(reply);
        if (fromReply) reminder = fromReply;
      }

      replaceThread(next, reminder);
    } catch (err) {
      const fallback = getMessages(language).reachError;
      const text = err instanceof Error ? err.message : fallback;
      setError(text);
    } finally {
      setSending(false);
    }
  }

  return {
    messages,
    isSending,
    error,
    reminder,
    sendConcern,
    relocalizeThread,
    markReminderDue,
    dismissReminder,
    clear,
  };
}
