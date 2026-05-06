'use client'
import { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessages } from './ChatMessages'
import { ChatInput } from './ChatInput'
import { QuickAskChips } from './QuickAskChips'
import { GreetingScreen } from './GreetingScreen'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store/chat-store'
import { FeatureMode } from '@/types/chat'

interface Props {
  featureMode: FeatureMode
  title: string
  description?: string
  placeholder?: string
  showFileUpload?: boolean
}

export function ChatPage({ featureMode, title, description, placeholder }: Props) {
  const { messages, isStreaming, sendMessage, sendFile } = useChat(featureMode)
  const { setFeatureMode, clearMessages } = useChatStore()

  useEffect(() => {
    setFeatureMode(featureMode)
    clearMessages()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureMode])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-4 py-3 border-b border-border bg-background/60 shrink-0">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      {/* Messages or greeting */}
      <ScrollArea className="flex-1">
        {hasMessages ? (
          <ChatMessages messages={messages} />
        ) : (
          <GreetingScreen onQuickAsk={sendMessage} />
        )}
      </ScrollArea>

      {/* Quick ask chips (only when no messages) */}
      {!hasMessages && (
        <div className="border-t border-border bg-background/60">
          <QuickAskChips onSelect={sendMessage} featureMode={featureMode} />
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        onSendFile={sendFile}
        isStreaming={isStreaming}
        featureMode={featureMode}
        placeholder={placeholder}
      />
    </div>
  )
}
