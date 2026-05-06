import { Lab } from '@/types/medical'
import labsData from '@/data/labs.json'

export interface LabFilters {
  test_name?: string
  home_collection?: boolean
  max_distance?: number
}

export interface LabService {
  getLabs(filters?: LabFilters): Promise<Lab[]>
}

class LocalLabService implements LabService {
  async getLabs(filters?: LabFilters): Promise<Lab[]> {
    let results = labsData as unknown as Lab[]

    if (filters?.test_name) {
      const q = filters.test_name.toLowerCase()
      results = results.filter((l) =>
        l.tests.some((t) => t.toLowerCase().includes(q)) ||
        Object.keys(l.pricing).some((k) => k.toLowerCase().includes(q))
      )
    }
    if (filters?.home_collection) {
      results = results.filter((l) => l.home_collection)
    }
    if (filters?.max_distance) {
      results = results.filter((l) => l.distance_km <= filters.max_distance!)
    }

    return results.sort((a, b) => b.rating - a.rating).slice(0, 4)
  }
}

export const labService: LabService = new LocalLabService()
