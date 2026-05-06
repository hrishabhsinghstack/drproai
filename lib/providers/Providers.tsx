'use client'
import React, { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { Toaster } from '@/components/ui/sonner'
import { useReminderStore } from '@/store/reminder-store'
import { startReminderScheduler } from '@/lib/reminders/reminder-scheduler'

function ReminderWatcher() {
  const { load, triggerAlert } = useReminderStore()

  useEffect(() => {
    load()
    const stop = startReminderScheduler((reminder) => {
      triggerAlert(reminder)
    })
    return stop
  }, [load, triggerAlert])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ProfileProvider>
        <ReminderWatcher />
        {children}
        <Toaster position="top-right" richColors />
      </ProfileProvider>
    </ThemeProvider>
  )
}
