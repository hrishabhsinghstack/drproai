import { CycleLog, CycleSettings, CyclePrediction, CyclePhase } from '@/types/period'
import { daysBetween, addDays, todayISO } from '@/lib/utils'

export function calculatePrediction(
  cycles: CycleLog[],
  settings: CycleSettings
): CyclePrediction | null {
  if (cycles.length === 0) return null

  const sorted = [...cycles].sort(
    (a, b) => new Date(a.period_start).getTime() - new Date(b.period_start).getTime()
  )

  // Step 1 — Calculate historical cycle lengths
  const lengths: number[] = []
  for (let i = 1; i < sorted.length; i++) {
    const len = daysBetween(sorted[i - 1].period_start, sorted[i].period_start)
    if (len >= 15 && len <= 50) lengths.push(len)
  }

  // Step 2 — Weighted average (recent = higher weight)
  let avgCycleLength = settings.avg_cycle_length
  let confidence: 'low' | 'medium' | 'high' = 'low'

  if (lengths.length >= 3) {
    const totalWeight = lengths.reduce((sum, _, i) => sum + (i + 1), 0)
    avgCycleLength = Math.round(
      lengths.reduce((sum, len, i) => sum + len * (i + 1), 0) / totalWeight
    )
    confidence = 'high'
  } else if (lengths.length === 2) {
    avgCycleLength = Math.round((lengths[0] + lengths[1]) / 2)
    confidence = 'medium'
  } else if (lengths.length === 1) {
    avgCycleLength = lengths[0]
    confidence = 'low'
  }

  const lastCycle = sorted[sorted.length - 1]
  const lastStart = lastCycle.period_start
  const today = todayISO()

  // Step 3 — Predict next period
  const predictedNext = addDays(lastStart, avgCycleLength)
  const daysUntil = daysBetween(today, predictedNext)

  // Step 4 — Current phase
  const dayInCycle = daysBetween(lastStart, today) + 1
  const periodLength = settings.avg_period_length

  let currentPhase: CyclePhase = 'luteal'
  if (dayInCycle <= periodLength) {
    currentPhase = 'menstrual'
  } else if (dayInCycle <= Math.round(avgCycleLength * 0.45)) {
    currentPhase = 'follicular'
  } else if (dayInCycle <= Math.round(avgCycleLength * 0.55)) {
    currentPhase = 'ovulation'
  }

  // Step 5 — Ovulation & fertile window
  const ovulationDay = avgCycleLength - 14
  const ovulationEstimate = addDays(lastStart, ovulationDay)
  const fertileStart = addDays(lastStart, ovulationDay - 5)
  const fertileEnd = addDays(lastStart, ovulationDay + 1)

  return {
    predicted_next_period: predictedNext,
    days_until_next: daysUntil,
    current_phase: currentPhase,
    current_phase_day: dayInCycle,
    fertile_window_start: fertileStart,
    fertile_window_end: fertileEnd,
    ovulation_estimate: ovulationEstimate,
    confidence,
    avg_cycle_length: avgCycleLength,
  }
}

export function getPhaseInfo(phase: CyclePhase): {
  name: string
  description: string
  tips: string[]
  color: string
  emoji: string
} {
  const map = {
    menstrual: {
      name: 'Menstrual Phase',
      description: 'Your period is here. Uterine lining sheds and estrogen/progesterone are at their lowest.',
      tips: ['Rest and stay hydrated', 'Use a heating pad for cramps', 'Iron-rich foods: spinach, lentils, jaggery', 'Light yoga or gentle walks are okay', 'Track your flow and symptoms'],
      color: 'rose',
      emoji: '🌸',
    },
    follicular: {
      name: 'Follicular Phase',
      description: 'Estrogen rises as follicles develop. Energy levels increase and you may feel more focused.',
      tips: ['Great time to start new projects', 'Try high-intensity workouts', 'Eat protein and complex carbs', 'Social activities feel easier now', 'Plan and set goals for the month'],
      color: 'green',
      emoji: '🌱',
    },
    ovulation: {
      name: 'Ovulation / Fertile Phase',
      description: 'Peak estrogen triggers the release of an egg. You may feel more confident and energetic.',
      tips: ['Your most fertile window — use protection if not trying to conceive', 'High energy — great for competitive or social activities', 'Eat zinc-rich foods: pumpkin seeds, chickpeas', 'Communicate important things — you\'re at your most articulate', 'Good time for important meetings or conversations'],
      color: 'purple',
      emoji: '✨',
    },
    luteal: {
      name: 'Luteal Phase',
      description: 'Progesterone rises to prepare for pregnancy. You may experience PMS symptoms in the second half.',
      tips: ['Reduce caffeine and sugar to minimize PMS', 'Magnesium helps with cramps and mood', 'Prioritize sleep — you need more now', 'Gentle exercise: walking, yoga, swimming', 'Practice self-compassion — mood swings are hormonal'],
      color: 'amber',
      emoji: '🌙',
    },
  }
  return map[phase]
}
