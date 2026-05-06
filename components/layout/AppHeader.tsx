'use client'
import Link from 'next/link'
import { Menu, HeartPulse } from 'lucide-react'
import { useUIStore } from '@/store/ui-store'
import { useProfileContext } from '@/contexts/ProfileContext'

export function AppHeader() {
  const { toggleSidebar } = useUIStore()
  const { profile } = useProfileContext()
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0 z-10 sticky top-0">
      <Link href="/chat" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <HeartPulse className="w-4 h-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <span className="text-sm font-bold text-foreground">DrPro</span>
          <span className="text-sm font-medium text-primary"> AI</span>
        </div>
      </Link>

      <p className="text-xs text-muted-foreground hidden md:block ml-1">Smart Health Chatbot</p>

      <div className="flex-1" />

      <Link
        href="/chat/profile"
        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold hover:bg-primary/90 transition-colors"
        title="My Profile"
      >
        {initials}
      </Link>
    </header>
  )
}
