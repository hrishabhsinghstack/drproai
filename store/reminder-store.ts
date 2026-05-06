'use client'
import { create } from 'zustand'
import { Reminder } from '@/types/reminder'
import { reminderStorage } from '@/lib/storage/reminder-storage'

interface ReminderStore {
  reminders: Reminder[]
  activeAlert: Reminder | null
  load: () => void
  add: (r: Reminder) => void
  toggle: (id: string) => void
  remove: (id: string) => void
  dismissAlert: () => void
  triggerAlert: (r: Reminder) => void
}

export const useReminderStore = create<ReminderStore>((set, get) => ({
  reminders: [],
  activeAlert: null,
  load: () => set({ reminders: reminderStorage.getAll() }),
  add: (r) => {
    reminderStorage.add(r)
    set((s) => ({ reminders: [r, ...s.reminders] }))
  },
  toggle: (id) => {
    reminderStorage.update(id, { is_active: !get().reminders.find((r) => r.id === id)?.is_active })
    set((s) => ({
      reminders: s.reminders.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r)),
    }))
  },
  remove: (id) => {
    reminderStorage.remove(id)
    set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) }))
  },
  dismissAlert: () => set({ activeAlert: null }),
  triggerAlert: (r) => set({ activeAlert: r }),
}))
