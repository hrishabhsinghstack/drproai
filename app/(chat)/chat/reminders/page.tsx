'use client'
import { useState } from 'react'
import { useReminders } from '@/hooks/useReminders'
import { Reminder, ReminderType, WeekDay } from '@/types/reminder'
import { Bell, BellOff, Plus, Trash2, Pill, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const TYPE_CONFIG: Record<ReminderType, { icon: React.ElementType; color: string; label: string }> = {
  medication: { icon: Pill, color: 'text-blue-500', label: 'Medication' },
  period: { icon: Calendar, color: 'text-pink-500', label: 'Period' },
  appointment: { icon: Calendar, color: 'text-purple-500', label: 'Appointment' },
  custom: { icon: Bell, color: 'text-amber-500', label: 'Custom' },
}

const ALL_DAYS: WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const DAY_LABELS: Record<WeekDay, string> = { mon: 'M', tue: 'T', wed: 'W', thu: 'T', fri: 'F', sat: 'S', sun: 'S' }

export default function RemindersPage() {
  const { reminders, activeAlert, createReminder, toggleReminder, deleteReminder, dismissAlert } = useReminders()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'medication' as ReminderType, title: '', description: '', time: '08:00', days: ALL_DAYS })

  const handleCreate = () => {
    if (!form.title.trim() || !form.time) return
    createReminder({ ...form, is_active: true, date: null })
    setForm({ type: 'medication', title: '', description: '', time: '08:00', days: ALL_DAYS })
    setShowForm(false)
  }

  const toggleDay = (day: WeekDay) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }))
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Active alert */}
      {activeAlert && (
        <div className="bg-primary text-white rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-200">
          <Bell className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{activeAlert.title}</p>
            {activeAlert.description && <p className="text-xs text-white/80">{activeAlert.description}</p>}
          </div>
          <button onClick={dismissAlert} className="text-white/70 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Health Reminders</h2>
        <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3.5 h-3.5" />
          New Reminder
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white dark:bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Create Reminder</h3>

          {/* Type */}
          <div className="flex gap-2">
            {(Object.keys(TYPE_CONFIG) as ReminderType[]).map((t) => {
              const { icon: Icon, label } = TYPE_CONFIG[t]
              return (
                <button
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs border transition-colors',
                    form.type === t ? 'bg-primary text-white border-primary' : 'border-border hover:bg-secondary'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}
          </div>

          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Reminder title e.g. Take Metformin 500mg"
            className="w-full text-sm border border-border rounded-xl px-3 py-2.5 bg-background placeholder:text-muted-foreground outline-none focus:border-primary"
          />

          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Notes (optional)"
            className="w-full text-sm border border-border rounded-xl px-3 py-2.5 bg-background placeholder:text-muted-foreground outline-none focus:border-primary"
          />

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              className="text-sm border border-border rounded-xl px-3 py-2 bg-background"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">Repeat on days</label>
            <div className="flex gap-1.5">
              {ALL_DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'w-8 h-8 rounded-full text-xs font-medium transition-colors',
                    form.days.includes(day)
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={handleCreate} className="flex-1 h-9 text-sm">Save Reminder</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="h-9">Cancel</Button>
          </div>
        </div>
      )}

      {/* Reminders list */}
      {reminders.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No reminders yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add medication reminders, period alerts, and more</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r: Reminder) => {
            const { icon: Icon, color, label } = TYPE_CONFIG[r.type]
            return (
              <div key={r.id} className={cn('bg-white dark:bg-card border border-border rounded-2xl p-4 shadow-sm', !r.is_active && 'opacity-50')}>
                <div className="flex items-start gap-3">
                  <div className={cn('w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0', !r.is_active && 'grayscale')}>
                    <Icon className={cn('w-4 h-4', color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                      <Badge variant="secondary" className="text-[10px] shrink-0">{label}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{r.time}</span>
                      {r.days.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{r.days.map((d) => DAY_LABELS[d]).join(' ')}</span>
                        </>
                      )}
                    </div>
                    {r.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleReminder(r.id)} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
                      {r.is_active ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteReminder(r.id)} className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-destructive rounded-lg hover:bg-secondary transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
