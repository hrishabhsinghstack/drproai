'use client'
import { Phone, MapPin, X } from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

export function EmergencyBanner() {
  const { emergencyDetected, setEmergency } = useChatStore()
  if (!emergencyDetected) return null

  return (
    <div className="bg-destructive text-white px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top duration-300">
      <span className="text-xl shrink-0">🚨</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">This sounds serious — please get immediate help</p>
        <p className="text-xs opacity-90">Do not wait if you are experiencing a medical emergency</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <a
          href="tel:112"
          className="flex items-center gap-1.5 bg-white text-destructive text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Call 112
        </a>
        <button
          className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors"
          onClick={() => window.open('https://maps.google.com/?q=hospital+near+me', '_blank')}
        >
          <MapPin className="w-3.5 h-3.5" />
          Nearest Hospital
        </button>
      </div>
      <button onClick={() => setEmergency(false)} className="text-white/70 hover:text-white shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
