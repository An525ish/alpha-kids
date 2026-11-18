"use client";

import { create } from "zustand";
import type {
  CheckInReminder,
  CoachApiReply,
  ConversationMessage,
} from "../types";
import { reminderFromReply } from "../utils/checkIn";
import { createId } from "../utils/history";

type ConversationState = {
  messages: ConversationMessage[];
  isSending: boolean;
  error: string | null;
  reminder: CheckInReminder | null;
  addParentMessage: (content: string) => string;
  addCoachMessage: (reply: CoachApiReply) => void;
  setSending: (value: boolean) => void;
  setError: (message: string | null) => void;
  markReminderDue: () => void;
  dismissReminder: () => void;
  clear: () => void;
};

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  isSending: false,
  error: null,
  reminder: null,
  addParentMessage: (content) => {
    const id = createId();
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id,
          role: "parent",
          content,
          createdAt: Date.now(),
        },
      ],
      error: null,
    }));
    return id;
  },
  addCoachMessage: (reply) => {
    const reminder = reminderFromReply(reply);
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: createId(),
          role: "coach",
          reply,
          createdAt: Date.now(),
        },
      ],
      reminder: reminder ?? state.reminder,
    }));
  },
  setSending: (value) => set({ isSending: value }),
  setError: (message) => set({ error: message }),
  markReminderDue: () =>
    set((state) =>
      state.reminder && state.reminder.status === "pending"
        ? { reminder: { ...state.reminder, status: "due" } }
        : state,
    ),
  dismissReminder: () => set({ reminder: null }),
  clear: () =>
    set({ messages: [], error: null, isSending: false, reminder: null }),
}));
