export type PeriodFlow = 'light' | 'medium' | 'heavy'

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal'

export interface CycleLog {
  id: string
  period_start: string
  period_end: string | null
  cycle_length: number | null
  flow: PeriodFlow
  symptoms: string[]
  notes: string
  created_at: string
}

export interface CycleSettings {
  avg_cycle_length: number
  avg_period_length: number
  last_updated: string
}

export interface CyclePrediction {
  predicted_next_period: string
  days_until_next: number
  current_phase: CyclePhase
  current_phase_day: number
  fertile_window_start: string
  fertile_window_end: string
  ovulation_estimate: string
  confidence: 'low' | 'medium' | 'high'
  avg_cycle_length: number
}
