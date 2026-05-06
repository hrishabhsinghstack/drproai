import { Message } from '@/types/chat'
import { STORAGE_KEYS } from './keys'

type ChatHistory = Record<string, Message[]>

export const chatStorage = {
  getAll(): ChatHistory {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  },
  getSession(sessionId: string): Message[] {
    return this.getAll()[sessionId] ?? []
  },
  saveSession(sessionId: string, messages: Message[]): void {
    if (typeof window === 'undefined') return
    const all = this.getAll()
    all[sessionId] = messages.slice(-50)
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(all))
  },
  clearSession(sessionId: string): void {
    if (typeof window === 'undefined') return
    const all = this.getAll()
    delete all[sessionId]
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(all))
  },
}
