import { AppHeader } from '@/components/layout/AppHeader'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner'
import { EmergencyFAB } from '@/components/emergency/EmergencyFAB'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EmergencyBanner />
      <AppHeader />
      <div className="flex flex-1 overflow-hidden max-w-3xl mx-auto w-full">
        <main className="flex-1 overflow-hidden flex flex-col bg-background">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <EmergencyFAB />
    </div>
  )
}
