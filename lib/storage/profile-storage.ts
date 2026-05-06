import { PatientProfile } from '@/types/profile'
import { STORAGE_KEYS } from './keys'

export const profileStorage = {
  get(): PatientProfile | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(profile: PatientProfile): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(profile))
  },
  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.PATIENT_PROFILE)
  },
}
