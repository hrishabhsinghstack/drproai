import { Reminder } from '@/types/reminder'
import { STORAGE_KEYS } from './keys'

export const reminderStorage = {
  getAll(): Reminder[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },
  save(reminders: Reminder[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders))
  },
  add(reminder: Reminder): void {
    const all = this.getAll()
    all.unshift(reminder)
    this.save(all)
  },
  update(id: string, patch: Partial<Reminder>): void {
    const all = this.getAll().map((r) => (r.id === id ? { ...r, ...patch } : r))
    this.save(all)
  },
  remove(id: string): void {
    this.save(this.getAll().filter((r) => r.id !== id))
  },
}
