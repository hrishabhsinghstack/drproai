'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { PatientProfile } from '@/types/profile'
import { profileStorage } from '@/lib/storage/profile-storage'
import { nanoid } from 'nanoid'

interface ProfileContextValue {
  profile: PatientProfile | null
  isLoading: boolean
  updateProfile: (patch: Partial<PatientProfile>) => void
  resetProfile: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

const defaultProfile = (): PatientProfile => ({
  id: nanoid(),
  name: '',
  age: null,
  gender: null,
  blood_group: null,
  height_cm: null,
  weight_kg: null,
  allergies: [],
  conditions: [],
  current_medications: [],
  emergency_contact: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = profileStorage.get()
    setProfile(saved ?? defaultProfile())
    setIsLoading(false)
  }, [])

  const updateProfile = useCallback((patch: Partial<PatientProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...patch, updated_at: new Date().toISOString() }
      profileStorage.set(updated)
      return updated
    })
  }, [])

  const resetProfile = useCallback(() => {
    const fresh = defaultProfile()
    profileStorage.set(fresh)
    setProfile(fresh)
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfileContext must be used inside ProfileProvider')
  return ctx
}
