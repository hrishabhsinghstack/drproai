'use client'
import { create } from 'zustand'
import { Message, FeatureMode, CardPayload } from '@/types/chat'

interface ChatStore {
  messages: Message[]
  isStreaming: boolean
  featureMode: FeatureMode
  emergencyDetected: boolean
  setFeatureMode: (mode: FeatureMode) => void
  addMessage: (msg: Message) => void
  appendDelta: (id: string, delta: string) => void
  finalizeMessage: (id: string) => void
  appendCards: (id: string, cards: CardPayload[]) => void
  setStreaming: (v: boolean) => void
  setEmergency: (v: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isStreaming: false,
  featureMode: 'health_qa',
  emergencyDetected: false,
  setFeatureMode: (mode) => set({ featureMode: mode }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  appendDelta: (id, delta) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + delta } : m
      ),
    })),
  finalizeMessage: (id) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false } : m
      ),
    })),
  appendCards: (id, cards) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, cards: [...(m.cards ?? []), ...cards] } : m
      ),
    })),
  setStreaming: (v) => set({ isStreaming: v }),
  setEmergency: (v) => set({ emergencyDetected: v }),
  clearMessages: () => set({ messages: [], emergencyDetected: false }),
}))
