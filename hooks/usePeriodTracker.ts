'use client'
import { useState, useEffect, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { CycleLog, CycleSettings, PeriodFlow } from '@/types/period'
import { periodStorage } from '@/lib/storage/period-storage'
import { calculatePrediction } from '@/lib/period/cycle-calculator'
import { todayISO } from '@/lib/utils'

export function usePeriodTracker() {
  const [cycles, setCycles] = useState<CycleLog[]>([])
  const [settings, setSettings] = useState<CycleSettings>({ avg_cycle_length: 28, avg_period_length: 5, last_updated: '' })

  useEffect(() => {
    setCycles(periodStorage.getCycles())
    setSettings(periodStorage.getSettings())
  }, [])

  const prediction = cycles.length > 0 ? calculatePrediction(cycles, settings) : null

  const logPeriod = useCallback((start: string, flow: PeriodFlow = 'medium', symptoms: string[] = [], notes = '') => {
    const cycle: CycleLog = {
      id: nanoid(),
      period_start: start,
      period_end: null,
      cycle_length: null,
      flow,
      symptoms,
      notes,
      created_at: new Date().toISOString(),
    }
    periodStorage.addCycle(cycle)
    setCycles(periodStorage.getCycles())
  }, [])

  const endPeriod = useCallback((id: string) => {
    const today = todayISO()
    const existing = cycles.find((c) => c.id === id)
    if (existing) {
      periodStorage.addCycle({ ...existing, period_end: today })
    }
    const all = periodStorage.getCycles().map((c) => c.id === id ? { ...c, period_end: today } : c)
    periodStorage.saveCycles(all)
    setCycles(all)
  }, [cycles])

  const updateSettings = useCallback((patch: Partial<CycleSettings>) => {
    const updated = { ...settings, ...patch, last_updated: new Date().toISOString() }
    periodStorage.saveSettings(updated)
    setSettings(updated)
  }, [settings])

  return { cycles, settings, prediction, logPeriod, endPeriod, updateSettings }
}
