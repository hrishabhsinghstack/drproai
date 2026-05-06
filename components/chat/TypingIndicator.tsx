'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white text-sm">
        🤖
      </div>
      <div className="bg-white dark:bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
