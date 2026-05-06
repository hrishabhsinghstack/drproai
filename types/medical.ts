export interface Doctor {
  id: string
  name: string
  specialty: string
  qualification: string
  hospital: string
  location: string
  distance_km: number
  rating: number
  reviews_count: number
  experience_years: number
  languages: string[]
  available_slots: string[]
  next_available: string
  consultation_fee: number
  online_consultation: boolean
  profile_image: string | null
  tags: string[]
}

export interface Lab {
  id: string
  name: string
  location: string
  distance_km: number
  rating: number
  timing: string
  home_collection: boolean
  home_collection_charge: number
  tests: string[]
  pricing: Record<string, number>
  accreditation: string
  phone: string
}

export interface ExerciseStep {
  step: string
}

export interface Exercise {
  id: string
  name: string
  type: string
  duration_minutes: number
  frequency: string
  intensity: 'low' | 'moderate' | 'high'
  description: string
  steps: string[]
  caution: string
  benefits: string[]
  image_emoji: string
}

export interface LabTestRange {
  min: number
  max: number
  unit: string
}

export interface LabTestReference {
  id: string
  test_name: string
  abbreviation: string
  category: string
  what_it_measures: string
  normal_range: {
    male?: LabTestRange
    female?: LabTestRange
    child?: LabTestRange
    general?: LabTestRange
  }
  low_means: string
  high_means: string
  preparation: string
}

export interface Medicine {
  id: string
  generic_name: string
  brand_names: string[]
  drug_class: string
  used_for: string[]
  standard_doses: string[]
  frequency: string
  common_side_effects: string[]
  serious_warnings: string[]
  interactions: string[]
  food_interactions: string
}

export interface Supplement {
  id: string
  name: string
  dosage: string
  form: string
  brand_suggestions: string[]
  benefits: string[]
  caution: string
  when_to_take: string
  conditions: string[]
}
