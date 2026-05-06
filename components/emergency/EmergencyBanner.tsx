'use client'
import { Phone, MapPin, X } from 'lucide-react'
import { useChatStore } from '@/store/chat-store'

export function EmergencyBanner() {
  const { emergencyDetected, setEmergency } = useChatStore()
  if (!emergencyDetected) return null

  return (
    <div className="bg-destructive text-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-in slide-in-from-top duration-300 relative">
      <div className="flex gap-3 items-start w-full pr-6">
        <span className="text-xl shrink-0 mt-0.5 sm:mt-0">🚨</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug">This sounds serious — please get immediate help</p>
          <p className="text-[11px] sm:text-xs opacity-90 mt-0.5">Do not wait if you are experiencing a medical emergency</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto pl-9 sm:pl-0">
        <a
          href="tel:112"
          className="flex items-center justify-center gap-1.5 bg-white text-destructive text-xs font-bold px-4 py-2 rounded-full hover:bg-white/90 transition-colors shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          Call 112
        </a>
        <button
          className="flex items-center justify-center gap-1.5 bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          onClick={() => window.open('https://maps.google.com/?q=hospital+near+me', '_blank')}
        >
          <MapPin className="w-3.5 h-3.5" />
          Nearest Hospital
        </button>
      </div>
      <button onClick={() => setEmergency(false)} className="absolute top-3 right-3 text-white/70 hover:text-white shrink-0 p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
