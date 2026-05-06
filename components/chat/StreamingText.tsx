'use client'
import React, { useEffect, useRef } from 'react'

interface Props {
  text: string
  isStreaming?: boolean
}

export function StreamingText({ text, isStreaming }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isStreaming && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [text, isStreaming])

  // Convert markdown-like text to JSX
  const renderText = (raw: string) => {
    const lines = raw.split('\n')
    return lines.map((line, i) => {
      // Bold **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>
        }
        return <span key={j}>{part}</span>
      })

      // Heading
      if (line.startsWith('### ')) return <h3 key={i} className="font-semibold text-sm mt-3 mb-1 text-foreground">{line.slice(4)}</h3>
      if (line.startsWith('## ')) return <h2 key={i} className="font-bold text-base mt-4 mb-1 text-foreground">{line.slice(3)}</h2>
      if (line.startsWith('# ')) return <h1 key={i} className="font-bold text-lg mt-4 mb-2 text-foreground">{line.slice(2)}</h1>

      // Bullet
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} className="flex gap-2 my-0.5">
            <span className="text-primary mt-0.5 shrink-0">•</span>
            <span>{parts.slice(1)}</span>
          </div>
        )
      }

      // Numbered list
      const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
      if (numberedMatch) {
        return (
          <div key={i} className="flex gap-2 my-0.5">
            <span className="text-primary font-medium shrink-0">{numberedMatch[1]}.</span>
            <span>{numberedMatch[2]}</span>
          </div>
        )
      }

      // Empty line
      if (!line.trim()) return <div key={i} className="h-2" />

      return <p key={i} className="my-0.5 leading-relaxed">{parts}</p>
    })
  }

  return (
    <div ref={ref} className="text-sm leading-relaxed">
      {renderText(text)}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-primary/60 ml-0.5 rounded-sm animate-pulse align-text-bottom" />
      )}
    </div>
  )
}
