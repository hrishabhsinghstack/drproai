'use client'
import { useEffect, useRef } from 'react'
import { Message } from '@/types/chat'
import { MessageBubble } from './MessageBubble'

interface Props {
  messages: Message[]
  onQuickAsk: (text: string) => void
}

export function ChatMessages({ messages, onQuickAsk }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex flex-col gap-1 py-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onQuickAsk={onQuickAsk} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
