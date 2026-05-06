import { STORAGE_KEYS } from './keys'

export interface SymptomEntry {
  id: string
  timestamp: string
  symptoms: string[]
  severity: 1 | 2 | 3 | 4 | 5
  duration: string
  notes: string
  gemini_assessment: string
}

export const symptomStorage = {
  getAll(): SymptomEntry[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOG)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },
  append(entry: Omit<SymptomEntry, 'id' | 'timestamp'>): SymptomEntry {
    const full: SymptomEntry = {
      ...entry,
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
    }
    const all = this.getAll()
    all.unshift(full)
    localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOG, JSON.stringify(all.slice(0, 100)))
    return full
  },
  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.SYMPTOM_LOG)
  },
}
