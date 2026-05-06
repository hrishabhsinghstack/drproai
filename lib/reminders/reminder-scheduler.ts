import { reminderStorage } from '@/lib/storage/reminder-storage'
import { Reminder, WeekDay } from '@/types/reminder'

const DAY_MAP: Record<number, WeekDay> = {
  0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat',
}

function shouldFire(reminder: Reminder): boolean {
  if (!reminder.is_active) return false
  const now = new Date()
  const [hh, mm] = reminder.time.split(':').map(Number)
  const nowH = now.getHours()
  const nowM = now.getMinutes()

  if (Math.abs(nowH * 60 + nowM - (hh * 60 + mm)) > 1) return false

  if (reminder.date) {
    return now.toISOString().split('T')[0] === reminder.date
  }
  if (reminder.days.length > 0) {
    return reminder.days.includes(DAY_MAP[now.getDay()])
  }
  return true
}

export function startReminderScheduler(onFire: (r: Reminder) => void): () => void {
  const interval = setInterval(() => {
    const reminders = reminderStorage.getAll()
    reminders.forEach((r) => {
      if (shouldFire(r)) {
        const lastTriggered = r.last_triggered
        const now = new Date()
        if (!lastTriggered || daysBetween(lastTriggered, now.toISOString()) > 0 || now.getTime() - new Date(lastTriggered).getTime() > 60 * 60 * 1000) {
          reminderStorage.update(r.id, { last_triggered: now.toISOString() })
          onFire(r)
        }
      }
    })
  }, 60_000)

  return () => clearInterval(interval)
}

function daysBetween(a: string, b: string): number {
  return Math.abs(Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000))
}
