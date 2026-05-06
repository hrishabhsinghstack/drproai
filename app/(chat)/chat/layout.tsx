import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { EmergencyBanner } from '@/components/emergency/EmergencyBanner'
import { EmergencyFAB } from '@/components/emergency/EmergencyFAB'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EmergencyBanner />
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <main className="flex-1 overflow-hidden flex flex-col bg-[--chat-bg]">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <EmergencyFAB />
    </div>
  )
}
