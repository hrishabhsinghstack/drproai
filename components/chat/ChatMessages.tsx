'use client'
import { useEffect, useRef } from 'react'
import { Message } from '@/types/chat'
import { MessageBubble } from './MessageBubble'

interface Props {
  messages: Message[]
}

export function ChatMessages({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex flex-col gap-1 py-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
