import { Supplement } from '@/types/medical'
import supplementsData from '@/data/supplements.json'

export interface SupplementService {
  getSupplements(condition: string): Promise<Supplement[]>
}

class LocalSupplementService implements SupplementService {
  async getSupplements(condition: string): Promise<Supplement[]> {
    const q = condition.toLowerCase()
    return (supplementsData as Supplement[])
      .filter((s) => s.conditions.some((c) => c.includes(q)))
      .slice(0, 3)
  }
}

export const supplementService: SupplementService = new LocalSupplementService()
