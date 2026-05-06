'use client'
import { Phone } from 'lucide-react'
import { useState } from 'react'

export function EmergencyFAB() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div className="bg-destructive text-white rounded-2xl shadow-xl p-4 animate-in slide-in-from-bottom-4 duration-200 w-52">
          <p className="text-xs font-semibold mb-3">🚨 Emergency Contacts</p>
          <div className="space-y-2">
            <a href="tel:112" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 text-xs transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call 112 (Emergency)
            </a>
            <a href="tel:108" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 text-xs transition-colors">
              <Phone className="w-3.5 h-3.5" /> Call 108 (Ambulance)
            </a>
            <button
              className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 text-xs transition-colors"
              onClick={() => window.open('https://maps.google.com/?q=hospital+near+me', '_blank')}
            >
              🏥 Find Nearest Hospital
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 bg-destructive text-white rounded-full shadow-xl flex items-center justify-center hover:bg-destructive/90 transition-all hover:scale-105 active:scale-95"
        title="Emergency Help"
      >
        <Phone className="w-6 h-6" />
      </button>
    </div>
  )
}
