'use client'
import { useProfileContext } from '@/contexts/ProfileContext'
import { Activity, Stethoscope, CalendarDays, Pill } from 'lucide-react'

interface Props {
  onQuickAsk: (text: string) => void
}

const QUICK_ACTIONS = [
  { icon: Stethoscope, label: 'Check Symptoms', prompt: 'I want to check my symptoms', color: 'text-primary bg-primary/10' },
  { icon: Activity, label: 'Lab Report', prompt: 'I want to upload my lab report', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Pill, label: 'Medicine ID', prompt: 'I want to identify a medicine', color: 'text-amber-600 bg-amber-50' },
  { icon: CalendarDays, label: 'Period Tracker', prompt: 'I want to track my periods', color: 'text-pink-600 bg-pink-50' },
]

const HEALTH_TIPS = [
  '💧 Drink 8 glasses of water daily to improve energy and focus.',
  '🚶 30 minutes of walking daily reduces diabetes risk by 30%.',
  '😴 7–9 hours of sleep boosts immunity and improves mood.',
  '🥗 Eat a rainbow — colorful vegetables provide different nutrients.',
  '🧘 5 minutes of deep breathing daily can lower blood pressure.',
  '🌞 15–20 min of morning sun boosts Vitamin D and serotonin.',
]

export function GreetingScreen({ onQuickAsk }: Props) {
  const { profile } = useProfileContext()
  const firstName = profile?.name?.split(' ')[0] || 'there'
  const tip = HEALTH_TIPS[new Date().getDate() % HEALTH_TIPS.length]

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
      {/* Mascot */}
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-5xl mb-4 shadow-inner">
        🤖
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-bold text-foreground">
        Hi {firstName}! 👋
      </h1>
      <p className="text-muted-foreground mt-1 max-w-xs">
        How can I help with your health today?
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-sm">
        {QUICK_ACTIONS.map(({ icon: Icon, label, prompt, color }) => (
          <button
            key={label}
            onClick={() => onQuickAsk(prompt)}
            className="flex flex-col items-center gap-2 bg-white dark:bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-primary/30 transition-all text-sm font-medium text-foreground"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Daily tip */}
      <div className="mt-6 bg-secondary/80 rounded-2xl px-4 py-3 max-w-sm text-xs text-muted-foreground text-left w-full">
        <span className="font-medium text-foreground text-xs block mb-1">💡 Today&apos;s Health Tip</span>
        {tip}
      </div>
    </div>
  )
}
