import { Doctor } from '@/types/medical'
import doctorsData from '@/data/doctors.json'

export interface DoctorFilters {
  specialty?: string
  max_fee?: number
  online_only?: boolean
  location?: string
}

export interface DoctorService {
  getDoctors(filters?: DoctorFilters): Promise<Doctor[]>
  getDoctorById(id: string): Promise<Doctor | null>
}

class LocalDoctorService implements DoctorService {
  async getDoctors(filters?: DoctorFilters): Promise<Doctor[]> {
    let results = doctorsData as Doctor[]

    if (filters?.specialty) {
      const q = filters.specialty.toLowerCase()
      results = results.filter(
        (d) =>
          d.specialty.toLowerCase().includes(q) ||
          d.tags.some((t) => t.includes(q))
      )
    }
    if (filters?.max_fee) {
      results = results.filter((d) => d.consultation_fee <= filters.max_fee!)
    }
    if (filters?.online_only) {
      results = results.filter((d) => d.online_consultation)
    }

    return results.sort((a, b) => b.rating - a.rating).slice(0, 6)
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    return (doctorsData as Doctor[]).find((d) => d.id === id) ?? null
  }
}

// ← Swap this single line to switch to real API
export const doctorService: DoctorService = new LocalDoctorService()
