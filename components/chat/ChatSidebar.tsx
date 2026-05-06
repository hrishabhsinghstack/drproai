'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProfileContext } from '@/contexts/ProfileContext'
import { cn } from '@/lib/utils'
import {
  Stethoscope, FlaskConical, Pill, Eye, FileText, UserSearch,
  TestTube, Dumbbell, CalendarHeart, Bell, User, HeartPulse, X
} from 'lucide-react'
import { useUIStore } from '@/store/ui-store'

const NAV_ITEMS = [
  { href: '/chat', label: 'Health Q&A', icon: HeartPulse, description: 'Ask any health question' },
  { href: '/chat/symptoms', label: 'Symptom Checker', icon: Stethoscope, description: 'Track and analyze symptoms' },
  { href: '/chat/lab-report', label: 'Lab Reports', icon: FlaskConical, description: 'Upload & explain reports' },
  { href: '/chat/medicine', label: 'Medicine ID', icon: Pill, description: 'Identify medicines from photo' },
  { href: '/chat/skin', label: 'Skin Analysis', icon: Eye, description: 'Analyze skin concerns' },
  { href: '/chat/prescription', label: 'Prescription', icon: FileText, description: 'Explain prescriptions' },
  { href: '/chat/find-doctor', label: 'Find Doctor', icon: UserSearch, description: 'Book nearby doctors' },
  { href: '/chat/find-lab', label: 'Find Lab', icon: TestTube, description: 'Book lab tests' },
  { href: '/chat/exercises', label: 'Yoga & Exercise', icon: Dumbbell, description: 'Personalized fitness' },
  { href: '/chat/period-tracker', label: 'Period Tracker', icon: CalendarHeart, description: 'Track menstrual cycle', accent: true },
  { href: '/chat/reminders', label: 'Reminders', icon: Bell, description: 'Health reminders' },
  { href: '/chat/profile', label: 'My Profile', icon: User, description: 'Health profile' },
]

export function ChatSidebar() {
  const pathname = usePathname()
  const { profile } = useProfileContext()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const firstName = profile?.name?.split(' ')[0] || 'User'

  return (
    <>
      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed lg:relative top-0 left-0 h-full z-30 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-200',
          'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              D
            </div>
            <div>
              <p className="text-xs font-bold text-sidebar-foreground leading-tight">DrPro AI</p>
              <p className="text-[10px] text-muted-foreground">Hi, {firstName} 👋</p>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          {NAV_ITEMS.map(({ href, label, icon: Icon, accent }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar() }}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group',
                  active
                    ? accent
                      ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500'
                      : 'bg-sidebar-accent text-sidebar-primary border-r-2 border-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    active
                      ? accent ? 'text-pink-600' : 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary'
                  )}
                />
                <span className="truncate">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="bg-primary/10 rounded-xl p-3 text-xs text-primary">
            <p className="font-medium mb-1">🛡️ Health Privacy</p>
            <p className="text-muted-foreground text-[11px]">Your health data stays on your device. Nothing is shared.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
