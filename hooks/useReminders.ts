'use client'
import { useReminderStore } from '@/store/reminder-store'
import { Reminder } from '@/types/reminder'
import { nanoid } from 'nanoid'

export function useReminders() {
  const { reminders, activeAlert, add, toggle, remove, dismissAlert, load } = useReminderStore()

  const createReminder = (data: Omit<Reminder, 'id' | 'created_at' | 'last_triggered'>) => {
    add({
      ...data,
      id: nanoid(),
      created_at: new Date().toISOString(),
      last_triggered: null,
    })
  }

  return { reminders, activeAlert, createReminder, toggleReminder: toggle, deleteReminder: remove, dismissAlert, load }
}
