'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeartPulse, CalendarHeart, Dumbbell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/chat', label: 'Health AI', icon: HeartPulse },
  { href: '/chat/period-tracker', label: 'Period', icon: CalendarHeart },
  { href: '/chat/exercises', label: 'Exercise', icon: Dumbbell },
  { href: '/chat/profile', label: 'Profile', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden bg-background border-t border-border pb-safe shrink-0">
      <div className="flex">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/chat' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'fill-primary/20')} />
              <span>{label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-primary absolute top-2" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
