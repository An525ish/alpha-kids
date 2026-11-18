"use client";

import { postCoachMessage } from "../api/coach";
import { useConversationStore } from "../stores/conversation";
import { toApiHistory } from "../utils/history";

export function useCoach() {
  const messages = useConversationStore((s) => s.messages);
  const isSending = useConversationStore((s) => s.isSending);
  const error = useConversationStore((s) => s.error);
  const reminder = useConversationStore((s) => s.reminder);
  const addParentMessage = useConversationStore((s) => s.addParentMessage);
  const addCoachMessage = useConversationStore((s) => s.addCoachMessage);
  const setSending = useConversationStore((s) => s.setSending);
  const setError = useConversationStore((s) => s.setError);
  const markReminderDue = useConversationStore((s) => s.markReminderDue);
  const dismissReminder = useConversationStore((s) => s.dismissReminder);
  const clear = useConversationStore((s) => s.clear);

  async function sendConcern(raw: string) {
    const message = raw.trim();
    if (!message || isSending) return;

    const history = toApiHistory(messages);
    addParentMessage(message);
    setSending(true);
    setError(null);

    try {
      const reply = await postCoachMessage({ message, history });
      addCoachMessage(reply);
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "Could not reach the coach.";
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
    markReminderDue,
    dismissReminder,
    clear,
  };
}
