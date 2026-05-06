import { CycleLog, CycleSettings } from '@/types/period'
import { STORAGE_KEYS } from './keys'

export const periodStorage = {
  getCycles(): CycleLog[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PERIOD_CYCLES)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },
  saveCycles(cycles: CycleLog[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.PERIOD_CYCLES, JSON.stringify(cycles))
  },
  addCycle(cycle: CycleLog): void {
    const cycles = this.getCycles()
    const idx = cycles.findIndex((c) => c.id === cycle.id)
    if (idx >= 0) cycles[idx] = cycle
    else cycles.unshift(cycle)
    cycles.sort((a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime())
    this.saveCycles(cycles)
  },
  getSettings(): CycleSettings {
    if (typeof window === 'undefined') return { avg_cycle_length: 28, avg_period_length: 5, last_updated: '' }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PERIOD_SETTINGS)
      return raw ? JSON.parse(raw) : { avg_cycle_length: 28, avg_period_length: 5, last_updated: '' }
    } catch {
      return { avg_cycle_length: 28, avg_period_length: 5, last_updated: '' }
    }
  },
  saveSettings(settings: CycleSettings): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.PERIOD_SETTINGS, JSON.stringify(settings))
  },
}
