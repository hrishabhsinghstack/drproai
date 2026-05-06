export type ReminderType = 'medication' | 'period' | 'appointment' | 'custom'
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface Reminder {
  id: string
  type: ReminderType
  title: string
  description: string
  time: string
  days: WeekDay[]
  date: string | null
  is_active: boolean
  created_at: string
  last_triggered: string | null
}
