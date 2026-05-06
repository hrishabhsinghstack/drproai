export type Gender = 'male' | 'female' | 'other'
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export interface PatientProfile {
  id: string
  name: string
  age: number | null
  gender: Gender | null
  blood_group: BloodGroup | null
  height_cm: number | null
  weight_kg: number | null
  allergies: string[]
  conditions: string[]
  current_medications: string[]
  emergency_contact: string | null
  created_at: string
  updated_at: string
}
