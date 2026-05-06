import { Exercise } from '@/types/medical'
import exercisesData from '@/data/exercises.json'

export type ExerciseCondition =
  | 'diabetes' | 'hypertension' | 'pcod' | 'stress'
  | 'back_pain' | 'obesity' | 'thyroid' | 'general_fitness'

export interface ExerciseService {
  getExercises(condition: ExerciseCondition): Promise<Exercise[]>
}

class LocalExerciseService implements ExerciseService {
  async getExercises(condition: ExerciseCondition): Promise<Exercise[]> {
    const data = exercisesData as Record<string, Exercise[]>
    return data[condition] ?? data['general_fitness'] ?? []
  }
}

export const exerciseService: ExerciseService = new LocalExerciseService()
