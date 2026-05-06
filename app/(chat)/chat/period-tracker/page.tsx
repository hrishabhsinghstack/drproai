'use client'
import { useState } from 'react'
import { usePeriodTracker } from '@/hooks/usePeriodTracker'
import { getPhaseInfo } from '@/lib/period/cycle-calculator'
import { formatDate, todayISO } from '@/lib/utils'
import { CalendarHeart, Droplets, TrendingUp, Bell, Shield, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const FLOW_OPTIONS = [
  { value: 'light', label: 'Light', emoji: '🩸' },
  { value: 'medium', label: 'Medium', emoji: '🩸🩸' },
  { value: 'heavy', label: 'Heavy', emoji: '🩸🩸🩸' },
] as const

export default function PeriodTrackerPage() {
  const { cycles, prediction, settings, logPeriod, updateSettings } = usePeriodTracker()
  const [showLogForm, setShowLogForm] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<'light' | 'medium' | 'heavy'>('medium')
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const phase = prediction ? getPhaseInfo(prediction.current_phase) : null
  const lastCycle = cycles[0]

  const handleLog = () => {
    logPeriod(selectedDate, selectedFlow)
    setShowLogForm(false)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-3xl">
            🤖
          </div>
          <div>
            <h1 className="text-lg font-bold">Period Tracker</h1>
            <p className="text-xs text-white/80">Your personal cycle companion</p>
          </div>
        </div>

        {prediction ? (
          <div className="bg-white/15 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-white/70">Next period in</p>
                <p className="text-3xl font-bold">
                  {prediction.days_until_next < 0
                    ? 'Overdue'
                    : prediction.days_until_next === 0
                    ? 'Today'
                    : `${prediction.days_until_next} days`}
                </p>
                <p className="text-xs text-white/70 mt-0.5">{formatDate(prediction.predicted_next_period)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Cycle length</p>
                <p className="text-2xl font-bold">{prediction.avg_cycle_length}d</p>
                <Badge className="bg-white/20 text-white text-[10px] border-0 mt-1">
                  {prediction.confidence === 'high' ? '✅ High accuracy' : prediction.confidence === 'medium' ? '⚠️ Medium accuracy' : 'ℹ️ Estimating'}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/15 rounded-2xl p-4 text-center">
            <p className="text-sm">Log your first period to get predictions 📅</p>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Current Phase */}
        {phase && prediction && (
          <div className={cn('bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm')}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{phase.emoji}</span>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{phase.name}</h3>
                <p className="text-xs text-muted-foreground">Day {prediction.current_phase_day} of cycle</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
            <div className="space-y-1">
              {phase.tips.slice(0, 3).map((tip, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Log Period */}
        <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-pink-500" />
              <h3 className="font-semibold text-sm text-foreground">Log Period</h3>
            </div>
            <Button
              size="sm"
              variant={showLogForm ? 'outline' : 'default'}
              className="h-7 text-xs"
              onClick={() => setShowLogForm(!showLogForm)}
            >
              {showLogForm ? 'Cancel' : '+ Log Period'}
            </Button>
          </div>

          {showLogForm && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  max={todayISO()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Flow</label>
                <div className="flex gap-2">
                  {FLOW_OPTIONS.map(({ value, label, emoji }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedFlow(value)}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs border transition-colors',
                        selectedFlow === value
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'border-border text-foreground hover:bg-secondary'
                      )}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleLog} className="w-full h-9 bg-pink-500 hover:bg-pink-600 text-white">
                Save Period Log
              </Button>
            </div>
          )}

          {/* Recent logs */}
          {cycles.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-medium text-foreground">Recent Cycles</p>
              {cycles.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(c.period_start)}</span>
                  <span className="text-pink-500">{c.flow} flow</span>
                  {c.cycle_length && <span>{c.cycle_length}d cycle</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fertile Window */}
        {prediction && (
          <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-sm text-foreground">Fertile Window</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3">
                <p className="text-[10px] text-purple-600 mb-0.5">Fertile Window</p>
                <p className="text-xs font-semibold text-foreground">{formatDate(prediction.fertile_window_start)}</p>
                <p className="text-[10px] text-muted-foreground">to {formatDate(prediction.fertile_window_end)}</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-xl p-3">
                <p className="text-[10px] text-pink-600 mb-0.5">Estimated Ovulation</p>
                <p className="text-xs font-semibold text-foreground">{formatDate(prediction.ovulation_estimate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cycle Settings */}
        <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CalendarHeart className="w-4 h-4 text-pink-500" />
            <h3 className="font-semibold text-sm text-foreground">Cycle Settings</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Avg Cycle Length (days)</label>
              <input
                type="number"
                min={20}
                max={45}
                value={settings.avg_cycle_length}
                onChange={(e) => updateSettings({ avg_cycle_length: parseInt(e.target.value) })}
                className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-background"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Avg Period Length (days)</label>
              <input
                type="number"
                min={2}
                max={10}
                value={settings.avg_period_length}
                onChange={(e) => updateSettings({ avg_period_length: parseInt(e.target.value) })}
                className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Quick links */}
        {[
          { icon: Bell, label: 'Set Period Reminder', href: '/chat/reminders', color: 'text-amber-500' },
          { icon: ChevronRight, label: 'Yoga for PCOD & periods', href: '/chat/exercises', color: 'text-purple-500' },
        ].map(({ icon: Icon, label, href, color }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 bg-white dark:bg-card rounded-2xl p-4 border border-border shadow-sm hover:border-primary/30 transition-colors"
          >
            <Icon className={cn('w-4 h-4', color)} />
            <span className="text-sm font-medium text-foreground flex-1">{label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </a>
        ))}

        {/* Privacy note */}
        <div className="flex items-start gap-2 bg-green-50 dark:bg-green-950/30 rounded-2xl p-4 border border-green-200">
          <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <p className="text-xs text-green-700">
            <span className="font-semibold">Your privacy is protected.</span> All period data is stored only on your device. Nothing is uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  )
}
